import { SearchService } from './search.service';
import { SearchQueryDto } from './dto/search-query.dto';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    search(searchQueryDto: SearchQueryDto): Promise<import("../users/dto/user-response.dto").UserResponseDto[] | import("../posts/dto/post-response.dto").PostResponseDto[]>;
}
