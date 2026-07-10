package in.bushansirgur.foodiesapi.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GeminiRequest {

    private List<Content> contents;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Content {
        private List<Part> parts;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Part {
        private String text;
    }
}
