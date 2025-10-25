package com.rentify.sample3.repository;

import com.rentify.sample3.model.House;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface HouseRepository extends JpaRepository<House, Long> {

    Page<House> findByOwnerId(Long ownerId, Pageable pageable);

    @Query("SELECT h FROM House h WHERE " +
            "(:keyword IS NULL OR LOWER(h.location) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            " OR LOWER(h.title) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:maxPrice IS NULL OR h.price <= :maxPrice)")
    Page<House> search(@Param("keyword") String keyword,
                       @Param("maxPrice") Double maxPrice,
                       Pageable pageable);
}
