package com.archeo.sample;

import java.util.List;

public class SampleAccount {
    private String id;

    public void process(List<String> items) {
        if (items != null && !items.isEmpty()) {
            for (String s : items) {
                System.out.println(s);
            }
        }
    }
}