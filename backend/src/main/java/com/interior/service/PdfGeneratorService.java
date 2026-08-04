package com.interior.service;

import com.interior.model.Project;
import com.interior.model.PaymentMilestone;
import com.interior.util.PdfFormatHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PdfGeneratorService {
    private final TemplateEngine templateEngine;

    public byte[] generateInvoicePdf(Project project) throws Exception {
        Context context = new Context();
        context.setVariable("project", project);
        context.setVariable("fmt", new PdfFormatHelper());

        // Parse scopes safely
        List<String> scopes = PdfFormatHelper.parseScope(project.getProjectScope());
        context.setVariable("scopes", scopes);

        // Precompute Net Taxable Amount
        BigDecimal subTotal = project.getSubTotal() != null ? project.getSubTotal() : BigDecimal.ZERO;
        BigDecimal discount = project.getDiscount() != null ? project.getDiscount() : BigDecimal.ZERO;
        BigDecimal netAmount = subTotal.subtract(discount);
        if (netAmount.compareTo(BigDecimal.ZERO) < 0) {
            netAmount = BigDecimal.ZERO;
        }
        context.setVariable("netAmount", netAmount);

        // Calculate milestone totals
        BigDecimal totalMilestonePercentage = BigDecimal.ZERO;
        BigDecimal totalMilestoneAmount = BigDecimal.ZERO;
        if (project.getPaymentMilestones() != null) {
            for (PaymentMilestone m : project.getPaymentMilestones()) {
                if (m.getPercentage() != null) {
                    totalMilestonePercentage = totalMilestonePercentage.add(m.getPercentage());
                }
                if (m.getAmount() != null) {
                    totalMilestoneAmount = totalMilestoneAmount.add(m.getAmount());
                }
            }
        }
        context.setVariable("totalMilestonePercentage", totalMilestonePercentage);
        context.setVariable("totalMilestoneAmount", totalMilestoneAmount);

        String htmlContent = templateEngine.process("invoice", context);

        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(htmlContent);
            renderer.layout();
            renderer.createPDF(outputStream);
            return outputStream.toByteArray();
        } catch (Exception e) {
            System.err.println("CRITICAL: PDF Generation failed!");
            e.printStackTrace();
            throw e;
        }
    }
}
