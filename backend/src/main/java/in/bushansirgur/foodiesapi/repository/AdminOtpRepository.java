package in.bushansirgur.foodiesapi.repository;

import in.bushansirgur.foodiesapi.entity.AdminOtpEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminOtpRepository extends MongoRepository<AdminOtpEntity, String> {
    Optional<AdminOtpEntity> findFirstByEmail(String email);
    void deleteByEmail(String email);
}
