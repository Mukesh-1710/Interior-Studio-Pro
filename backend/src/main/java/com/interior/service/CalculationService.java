package com.interior.service;

import com.interior.model.Item;
import com.interior.model.Project;
import com.interior.model.Room;
import org.springframework.stereotype.Service;

@Service
public class CalculationService {

    public void calculateProject(Project project) {
        double grandTotal = 0.0;
        for (Room room : project.getRooms()) {
            calculateRoom(room);
            grandTotal += room.getRoomTotal();
        }
        project.setGrandTotal(grandTotal);
    }

    public void calculateRoom(Room room) {
        double roomTotal = 0.0;
        for (Item item : room.getItems()) {
            calculateItem(item);
            roomTotal += item.getAmount();
        }
        room.setRoomTotal(roomTotal);
    }

    public void calculateItem(Item item) {
        double rate = item.getRate() != null ? item.getRate() : 0.0;
        int pieces = item.getPieces() != null ? item.getPieces() : 0;

        if ("sq.ft".equalsIgnoreCase(item.getUnit())) {
            double length = item.getLength() != null ? item.getLength() : 0.0;
            double width = item.getWidth() != null ? item.getWidth() : 0.0;
            double totalArea = length * width * pieces;
            item.setTotalArea(totalArea);
            item.setAmount(totalArea * rate);
        } else if ("pcs".equalsIgnoreCase(item.getUnit())) {
            item.setTotalArea((double) pieces); // For pieces, totalArea is just the count
            item.setAmount(pieces * rate);
        } else {
            item.setTotalArea(0.0);
            item.setAmount(0.0);
        }
    }
}
