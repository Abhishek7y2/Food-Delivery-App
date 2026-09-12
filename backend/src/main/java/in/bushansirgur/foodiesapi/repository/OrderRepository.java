package in.bushansirgur.foodiesapi.repository;

import in.bushansirgur.foodiesapi.entity.OrderEntity;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
//public interface OrderRepository extends MongoRepository<OrderEntity, ObjectId> {
public interface OrderRepository extends MongoRepository<OrderEntity, String> {
//    List<OrderEntity> findByOrderId(String userId);
    List<OrderEntity> findByUserId(String userId);

    Optional<OrderEntity> findByRazorpayOrderId(String razorpayOrderId);

}