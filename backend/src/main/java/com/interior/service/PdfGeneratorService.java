package com.interior.service;

import com.interior.model.Project;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayOutputStream;

@Service
@RequiredArgsConstructor
public class PdfGeneratorService {
    private final TemplateEngine templateEngine;

    public byte[] generateInvoicePdf(Project project) throws Exception {
        Context context = new Context();
        context.setVariable("project", project);
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
