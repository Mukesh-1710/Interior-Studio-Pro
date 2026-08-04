package com.interior.service;

import com.interior.model.MaterialSpecification;
import com.interior.model.PaymentMilestone;
import com.interior.model.Project;
import com.interior.model.QuotationTerm;
import com.interior.model.Room;
import com.interior.repository.ProjectRepository;
import com.interior.util.NumberToWordsConverter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final CalculationService calculationService;

    @Transactional
    public Project saveProject(Project project) {
        validateProject(project);

        if (project.getId() != null && projectRepository.existsById(project.getId())) {
            return updateExistingProject(project);
        } else {
            return createNewProject(project);
        }
    }

    private Project createNewProject(Project project) {
        // Run core frozen calculation engine
        calculationService.calculateProject(project);

        // Ensure Quotation Defaults
        applyQuotationDefaults(project);

        // Synchronize Commercials & Milestones
        synchronizeCommercialsAndMilestones(project);

        Project saved = projectRepository.save(project);

        // If quotation number is not provided, generate with official sequence
        if (saved.getQuotationNumber() == null || saved.getQuotationNumber().trim().isEmpty()) {
            int year = saved.getDate() != null ? saved.getDate().getYear() : LocalDate.now().getYear();
            saved.setQuotationNumber(String.format("RR/%d/QT-%03d", year, saved.getId()));
            saved = projectRepository.save(saved);
        }

        return saved;
    }

    private Project updateExistingProject(Project incoming) {
        Project existing = getProjectById(incoming.getId());

        // Update Quotation metadata
        if (incoming.getQuotationNumber() != null && !incoming.getQuotationNumber().trim().isEmpty()) {
            existing.setQuotationNumber(incoming.getQuotationNumber());
        }
        existing.setDate(incoming.getDate());
        existing.setValidUntil(incoming.getValidUntil());

        // Update Client Details
        existing.setClientName(incoming.getClientName());
        existing.setClientPhone(incoming.getClientPhone());
        existing.setClientEmail(incoming.getClientEmail());
        existing.setClientAddress(incoming.getClientAddress());

        // Update Project Details
        existing.setProjectName(incoming.getProjectName());
        existing.setProjectLocation(incoming.getProjectLocation());
        existing.setContractType(incoming.getContractType() != null ? incoming.getContractType() : "Material + Labour");
        existing.setEstimatedDuration(incoming.getEstimatedDuration());
        existing.setProjectScope(incoming.getProjectScope());

        // Update Warranty & Sign-off
        existing.setWarrantyTerms(incoming.getWarrantyTerms());
        existing.setClientSignName(incoming.getClientSignName());
        existing.setAuthorizedSignatory(incoming.getAuthorizedSignatory());

        // Synchronize Child Collections (Ensuring true JPA Orphan Removal & No Duplicates)
        existing.getRooms().clear();
        if (incoming.getRooms() != null) {
            existing.getRooms().addAll(incoming.getRooms());
        }

        existing.getMaterialSpecifications().clear();
        if (incoming.getMaterialSpecifications() != null) {
            existing.getMaterialSpecifications().addAll(incoming.getMaterialSpecifications());
        }

        existing.getPaymentMilestones().clear();
        if (incoming.getPaymentMilestones() != null) {
            existing.getPaymentMilestones().addAll(incoming.getPaymentMilestones());
        }

        existing.getQuotationTerms().clear();
        if (incoming.getQuotationTerms() != null) {
            existing.getQuotationTerms().addAll(incoming.getQuotationTerms());
        }

        // Run core frozen calculation engine
        calculationService.calculateProject(existing);

        // Copy incoming commercial adjustments if explicitly provided
        if (incoming.getDiscount() != null) {
            existing.setDiscount(incoming.getDiscount());
        }
        if (incoming.getTaxPercentage() != null) {
            existing.setTaxPercentage(incoming.getTaxPercentage());
        }
        if (incoming.getTaxAmount() != null) {
            existing.setTaxAmount(incoming.getTaxAmount());
        }

        // Apply defaults and sync commercials
        applyQuotationDefaults(existing);
        synchronizeCommercialsAndMilestones(existing);

        return projectRepository.save(existing);
    }

    private void applyQuotationDefaults(Project project) {
        if (project.getDate() == null) {
            project.setDate(LocalDate.now());
        }
        if (project.getValidUntil() == null) {
            project.setValidUntil(project.getDate().plusDays(30));
        }
        if (project.getContractType() == null || project.getContractType().trim().isEmpty()) {
            project.setContractType("Material + Labour");
        }
        if (project.getAuthorizedSignatory() == null || project.getAuthorizedSignatory().trim().isEmpty()) {
            project.setAuthorizedSignatory("Ramachandran (RR Interiors)");
        }
        if (project.getDiscount() == null) {
            project.setDiscount(BigDecimal.ZERO);
        }
        if (project.getTaxPercentage() == null) {
            project.setTaxPercentage(BigDecimal.ZERO);
        }
        if (project.getTaxAmount() == null) {
            project.setTaxAmount(BigDecimal.ZERO);
        }
    }

    private void synchronizeCommercialsAndMilestones(Project project) {
        // Map frozen estimation calculation total to SubTotal
        BigDecimal subTotal = BigDecimal.valueOf(project.getGrandTotal() != null ? project.getGrandTotal() : 0.0)
                .setScale(2, RoundingMode.HALF_UP);
        project.setSubTotal(subTotal);

        BigDecimal discount = project.getDiscount() != null ? project.getDiscount() : BigDecimal.ZERO;
        BigDecimal taxableAmount = subTotal.subtract(discount);
        if (taxableAmount.compareTo(BigDecimal.ZERO) < 0) {
            taxableAmount = BigDecimal.ZERO;
        }

        BigDecimal taxPercentage = project.getTaxPercentage() != null ? project.getTaxPercentage() : BigDecimal.ZERO;
        BigDecimal taxAmount = project.getTaxAmount();

        if (taxPercentage.compareTo(BigDecimal.ZERO) > 0 && (taxAmount == null || taxAmount.compareTo(BigDecimal.ZERO) == 0)) {
            taxAmount = taxableAmount.multiply(taxPercentage)
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            project.setTaxAmount(taxAmount);
        } else if (taxAmount == null) {
            taxAmount = BigDecimal.ZERO;
            project.setTaxAmount(taxAmount);
        }

        BigDecimal finalPayable = taxableAmount.add(taxAmount);
        project.setGrandTotal(finalPayable.doubleValue());

        // Convert final total to Indian Currency words
        project.setAmountInWords(NumberToWordsConverter.convertToIndianCurrencyWords(finalPayable));

        // Auto-calculate Milestone amounts if percentage is set and amount is zero/empty
        if (project.getPaymentMilestones() != null) {
            for (PaymentMilestone milestone : project.getPaymentMilestones()) {
                if (milestone.getPercentage() != null && milestone.getPercentage().compareTo(BigDecimal.ZERO) > 0) {
                    if (milestone.getAmount() == null || milestone.getAmount().compareTo(BigDecimal.ZERO) == 0) {
                        BigDecimal calculatedMilestoneAmount = finalPayable
                                .multiply(milestone.getPercentage())
                                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                        milestone.setAmount(calculatedMilestoneAmount);
                    }
                }
            }
        }
    }

    private void validateProject(Project project) {
        // Validate Contract Type if provided
        if (project.getContractType() != null && !project.getContractType().trim().isEmpty()) {
            String ct = project.getContractType().trim().toUpperCase();
            boolean valid = ct.contains("MATERIAL") || ct.contains("LABOUR") || ct.contains("TURNKEY");
            if (!valid) {
                throw new IllegalArgumentException("Invalid contract type: " + project.getContractType());
            }
        }

        // Validate Discounts and Taxes
        if (project.getDiscount() != null && project.getDiscount().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Discount cannot be negative");
        }
        if (project.getTaxPercentage() != null) {
            if (project.getTaxPercentage().compareTo(BigDecimal.ZERO) < 0 || project.getTaxPercentage().compareTo(BigDecimal.valueOf(100)) > 0) {
                throw new IllegalArgumentException("Tax percentage must be between 0 and 100");
            }
        }
        if (project.getTaxAmount() != null && project.getTaxAmount().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Tax amount cannot be negative");
        }

        // Validate Payment Milestones
        if (project.getPaymentMilestones() != null && !project.getPaymentMilestones().isEmpty()) {
            BigDecimal totalPercentage = BigDecimal.ZERO;
            for (PaymentMilestone milestone : project.getPaymentMilestones()) {
                if (milestone.getPercentage() != null) {
                    if (milestone.getPercentage().compareTo(BigDecimal.ZERO) < 0 || milestone.getPercentage().compareTo(BigDecimal.valueOf(100)) > 0) {
                        throw new IllegalArgumentException("Milestone percentage must be between 0 and 100: " + milestone.getMilestoneName());
                    }
                    totalPercentage = totalPercentage.add(milestone.getPercentage());
                }
                if (milestone.getAmount() != null && milestone.getAmount().compareTo(BigDecimal.ZERO) < 0) {
                    throw new IllegalArgumentException("Milestone amount cannot be negative: " + milestone.getMilestoneName());
                }
            }
            if (totalPercentage.compareTo(BigDecimal.valueOf(100.01)) > 0) {
                throw new IllegalArgumentException("Total payment milestone percentages exceed 100%: " + totalPercentage + "%");
            }
        }
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id).orElseThrow(() -> new RuntimeException("Project not found: " + id));
    }

    @Transactional
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }
}

