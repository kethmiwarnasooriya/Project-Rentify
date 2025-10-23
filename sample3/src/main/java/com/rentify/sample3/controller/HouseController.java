package com.rentify.sample3.controller;

import com.rentify.sample3.model.House;
import com.rentify.sample3.security.UserDetailsImpl;
import com.rentify.sample3.service.HouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "${app.frontend.url}", allowCredentials = "true")
public class HouseController {

    @Autowired private HouseService houseService;

    // ✅ Public: anyone can view all houses with pagination and search
    @GetMapping("/houses")
    public Page<House> getAll(@RequestParam(required = false) String keyword,
                              @RequestParam(required = false) Double maxPrice,
                              @RequestParam(defaultValue = "0") int page,
                              @RequestParam(defaultValue = "5") int size) {
        return houseService.search(keyword, maxPrice, PageRequest.of(page, size));
    }
}

// Owner controller
@RestController
@RequestMapping("/api/owner/houses")
@CrossOrigin(origins = "${app.frontend.url}", allowCredentials = "true")
class OwnerHouseController {

    @Autowired private HouseService houseService;

    @PostMapping
    public ResponseEntity<House> createHouse(@RequestBody House house,
                                             @AuthenticationPrincipal UserDetailsImpl currentUser) {
        House created = houseService.createHouse(house, currentUser.getId());
        return ResponseEntity.ok(created);
    }

    // ✅ Pagination added here too
    @GetMapping
    public Page<House> getOwnerHouses(@AuthenticationPrincipal UserDetailsImpl currentUser,
                                      @RequestParam(defaultValue = "0") int page,
                                      @RequestParam(defaultValue = "5") int size) {
        return houseService.getByOwner(currentUser.getId(), PageRequest.of(page, size));
    }

    @PutMapping("/{id}")
    public ResponseEntity<House> updateHouse(@PathVariable Long id,
                                             @RequestBody House updated,
                                             @AuthenticationPrincipal UserDetailsImpl currentUser) {
        House h = houseService.update(id, updated, currentUser.getId());
        return ResponseEntity.ok(h);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHouse(@PathVariable Long id,
                                         @AuthenticationPrincipal UserDetailsImpl currentUser) {
        houseService.delete(id, currentUser.getId());
        return ResponseEntity.ok("Deleted successfully");
    }
}
