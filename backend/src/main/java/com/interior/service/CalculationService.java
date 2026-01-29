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
        if ("sq.ft".equalsIgnoreCase(item.getUnit())) {
            if (item.getLength() != null && item.getWidth() != null) {
                item.setQty(item.getLength() * item.getWidth());
            } else {
                item.setQty(0.0);
            }
        }
        // If unit is "no.", qty is provided by user, so no calculation needed for qty.

        if (item.getQty() != null && item.getRate() != null) {
            item.setAmount(item.getQty() * item.getRate());
        } else {
            item.setAmount(0.0);
        }
    }
}
