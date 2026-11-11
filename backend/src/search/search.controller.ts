import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('Unified Global Search & Command Center')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('global')
  @ApiOperation({ summary: 'Cross-entity global search across modules, users, devices, alerts and assets' })
  globalSearch(@Query('q') q: string) {
    return this.searchService.globalSearch(q);
  }

  @Get('command-palette')
  @ApiOperation({ summary: 'Get command palette quick navigation actions (Ctrl+K)' })
  getCommands() {
    return this.searchService.getCommandPaletteCommands();
  }
}
