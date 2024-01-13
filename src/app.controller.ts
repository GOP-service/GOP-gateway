import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Swagger')
@Controller()
export class AppController {
  constructor() {}

  @Get()
  index(@Res() res) {
    res.status(302).redirect('/api/docs');
  }
  
}
