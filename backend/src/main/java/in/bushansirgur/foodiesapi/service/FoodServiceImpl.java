//package in.bushansirgur.foodiesapi.service;
//
package in.bushansirgur.foodiesapi.service;

import in.bushansirgur.foodiesapi.entity.FoodEntity;
import in.bushansirgur.foodiesapi.io.FoodRequest;
import in.bushansirgur.foodiesapi.io.FoodResponse;
import in.bushansirgur.foodiesapi.repository.FoodRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FoodServiceImpl implements FoodService {
    @Autowired
    private  S3Client s3Client;
    @Autowired
    private FoodRepository foodRepository;

    @Value("${aws.s3.bucketname}")
    private String bucketName;

    @Override
    public String uploadFile(MultipartFile file) {
        String fileNameExtension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".")+1);
        String key = UUID.randomUUID().toString()+"."+fileNameExtension;
        try{
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .acl("public-read")
                    .contentType(file.getContentType())
                    .build();
            PutObjectResponse response = s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));
            if(response.sdkHttpResponse().isSuccessful()){
                return "https://"+bucketName+".s3.amazonaws.com/"+key;
            }else {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"file upload failed");
            }
        }catch(IOException e){
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "an error occured while uploading the file");

        }

    }

    @Override
    public FoodResponse addFood(FoodRequest request, MultipartFile file) {
        FoodEntity newFoodEntity = convertToEntity(request);
        String imageUrl = uploadFile(file);
        newFoodEntity.setImageUrl(imageUrl);
        newFoodEntity = foodRepository.save(newFoodEntity);
        return convertToResponse(newFoodEntity);
    }

    @Override
    public List<FoodResponse> readFoods() {
        List<FoodEntity>databaseEntries = foodRepository.findAll();
        return databaseEntries.stream().map(object -> convertToResponse(object)).collect(Collectors.toList());
    }

    @Override
    public FoodResponse readFood(String id) {
       FoodEntity existingFood = foodRepository.findById(id).orElseThrow(() ->
               new RuntimeException("Food not found for the id:"+id));
       return convertToResponse(existingFood);
    }

    @Override
    public boolean deleteFile(String filename) {
        try {
            if (bucketName != null && !bucketName.equalsIgnoreCase("none")) {
                DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(filename)
                        .build();
                s3Client.deleteObject(deleteObjectRequest);
            }
        } catch (Exception e) {
            System.out.println("Dev Mode Notice: S3 file delete skipped (" + e.getMessage() + ")");
        }
        return true;
    }

    @Override
    public void deleteFood(String id) {
        FoodResponse response = readFood(id);
        if (response.getImageUrl() != null && response.getImageUrl().contains("s3.amazonaws.com")) {
            String imageUrl = response.getImageUrl();
            String filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
            deleteFile(filename);
        }
        foodRepository.deleteById(response.getId());
    }

    @Override
    public FoodResponse updateFood(String id, FoodRequest request) {
        FoodEntity existingFood = foodRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Food not found for the id:"+id));
        
        if (request.getName() != null && !request.getName().isEmpty()) {
            existingFood.setName(request.getName());
        }
        if (request.getDescription() != null && !request.getDescription().isEmpty()) {
            existingFood.setDescription(request.getDescription());
        }
        if (request.getPrice() != 0.0) {
            existingFood.setPrice(request.getPrice());
        }
        if (request.getCategory() != null && !request.getCategory().isEmpty()) {
            existingFood.setCategory(request.getCategory());
        }
        
        existingFood = foodRepository.save(existingFood);
        return convertToResponse(existingFood);
    }

    private FoodEntity convertToEntity(FoodRequest request) {
        return FoodEntity.builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .price(request.getPrice())
                .build();
    }

    private FoodResponse convertToResponse(FoodEntity entity) {
        return FoodResponse.builder()
                .id(entity.getId())
                .name(entity.getName())           // FIX 1: getname() → getName()
                .description(entity.getDescription())
                .category(entity.getCategory())
                .price(entity.getPrice())
                .imageUrl(entity.getImageUrl())
                .build();
    }
}
