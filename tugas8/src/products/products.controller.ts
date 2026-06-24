import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './schemas/product.schema';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // POST /products - Create a new product
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  // GET /products - Get all products
  @Get()
  async findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  // GET /products/search?q=keyword - Search products by name
  @Get('search')
  async search(@Query('q') keyword: string): Promise<Product[]> {
    if (!keyword || keyword.trim() === '') {
      return this.productsService.findAll();
    }
    return this.productsService.searchByName(keyword);
  }

  // GET /products/:id - Get a specific product
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  // PUT /products/:id - Update a product
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(id, updateProductDto);
  }

  // DELETE /products/:id - Delete a product
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    return this.productsService.delete(id);
  }
}
