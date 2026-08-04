package com.interior.util;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class PdfFormatHelper {

    public static String formatCurrency(Double amount) {
        if (amount == null) {
            return "₹ 0.00";
        }
        return formatCurrency(BigDecimal.valueOf(amount));
    }

    public static String formatCurrency(BigDecimal amount) {
        if (amount == null) {
            return "₹ 0.00";
        }
        BigDecimal scaled = amount.setScale(2, RoundingMode.HALF_UP);
        try {
            DecimalFormat formatter = (DecimalFormat) NumberFormat.getCurrencyInstance(new Locale("en", "IN"));
            DecimalFormatSymbols symbols = formatter.getDecimalFormatSymbols();
            symbols.setCurrencySymbol("₹ ");
            formatter.setDecimalFormatSymbols(symbols);
            return formatter.format(scaled);
        } catch (Exception e) {
            return "₹ " + scaled.toString();
        }
    }

    public static String formatDimension(Double length, Double width, String unit) {
        if (length == null && width == null) {
            return "—";
        }
        if ("pcs".equalsIgnoreCase(unit)) {
            return "—";
        }
        String lStr = length != null ? (length % 1 == 0 ? String.format("%.0f'", length) : String.format("%.2f'", length)) : "0'";
        String wStr = width != null ? (width % 1 == 0 ? String.format("%.0f'", width) : String.format("%.2f'", width)) : "0'";
        return lStr + " × " + wStr;
    }

    public static List<String> parseScope(String projectScope) {
        List<String> list = new ArrayList<>();
        if (projectScope == null || projectScope.trim().isEmpty()) {
            return list;
        }
        String trimmed = projectScope.trim();
        if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
            try {
                String inner = trimmed.substring(1, trimmed.length() - 1).trim();
                if (!inner.isEmpty()) {
                    String[] parts = inner.split(",");
                    for (String part : parts) {
                        String clean = part.trim();
                        if (clean.startsWith("\"") && clean.endsWith("\"") && clean.length() >= 2) {
                            clean = clean.substring(1, clean.length() - 1);
                        } else if (clean.startsWith("'") && clean.endsWith("'") && clean.length() >= 2) {
                            clean = clean.substring(1, clean.length() - 1);
                        }
                        if (!clean.isEmpty()) {
                            list.add(clean.replace("\\\"", "\""));
                        }
                    }
                }
            } catch (Exception e) {
                list.add(trimmed);
            }
        } else if (trimmed.contains(",")) {
            for (String p : trimmed.split(",")) {
                if (!p.trim().isEmpty()) {
                    list.add(p.trim());
                }
            }
        } else {
            list.add(trimmed);
        }
        return list;
    }
}
