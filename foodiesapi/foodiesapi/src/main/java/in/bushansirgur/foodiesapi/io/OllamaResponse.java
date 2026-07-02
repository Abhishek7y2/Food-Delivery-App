//package in.bushansirgur.foodiesapi.io;
//
//public class OllamaResponse {
//}

package in.bushansirgur.foodiesapi.io;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class OllamaResponse {

    @JsonProperty("response")
    private String response;

    @JsonProperty("done")
    private boolean done;

    @JsonProperty("model")
    private String model;
}
