//package in.bushansirgur.foodiesapi.io;
//
//public class OllamaRequest {
//}
package in.bushansirgur.foodiesapi.io;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OllamaRequest {

    private String model;

    private String prompt;

    @JsonProperty("stream")
    private boolean stream;
}
