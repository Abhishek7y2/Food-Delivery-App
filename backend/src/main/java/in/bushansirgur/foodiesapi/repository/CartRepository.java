package in.bushansirgur.foodiesapi.repository;

import in.bushansirgur.foodiesapi.entity.CartEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends MongoRepository<CartEntity,String>{

    @Override
    Optional<CartEntity> findById(String userId);

    void deleteByUserId(String userId);

    Optional<CartEntity> findByUserId(String userId);
}
