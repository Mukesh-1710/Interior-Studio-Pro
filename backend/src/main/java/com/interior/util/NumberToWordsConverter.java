package com.interior.util;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class NumberToWordsConverter {

    private static final String[] UNITS = {
        "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
        "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
    };

    private static final String[] TENS = {
        "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
    };

    public static String convertToIndianCurrencyWords(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) == 0) {
            return "Rupees Zero Only";
        }

        long roundedAmount = amount.setScale(0, RoundingMode.HALF_UP).longValue();
        if (roundedAmount == 0) {
            return "Rupees Zero Only";
        }

        String words = convertNumber(roundedAmount);
        return "Rupees " + words.trim() + " Only";
    }

    public static String convertToIndianCurrencyWords(Double amount) {
        if (amount == null || amount == 0.0) {
            return "Rupees Zero Only";
        }
        return convertToIndianCurrencyWords(BigDecimal.valueOf(amount));
    }

    private static String convertNumber(long n) {
        if (n < 0) {
            return "Minus " + convertNumber(-n);
        }
        if (n < 20) {
            return UNITS[(int) n];
        }
        if (n < 100) {
            return TENS[(int) (n / 10)] + ((n % 10 != 0) ? " " + UNITS[(int) (n % 10)] : "");
        }
        if (n < 1000) {
            return UNITS[(int) (n / 100)] + " Hundred" + ((n % 100 != 0) ? " " + convertNumber(n % 100) : "");
        }
        if (n < 100000) {
            return convertNumber(n / 1000) + " Thousand" + ((n % 1000 != 0) ? " " + convertNumber(n % 1000) : "");
        }
        if (n < 10000000) {
            return convertNumber(n / 100000) + " Lakh" + ((n % 100000 != 0) ? " " + convertNumber(n % 100000) : "");
        }
        return convertNumber(n / 10000000) + " Crore" + ((n % 10000000 != 0) ? " " + convertNumber(n % 10000000) : "");
    }
}
