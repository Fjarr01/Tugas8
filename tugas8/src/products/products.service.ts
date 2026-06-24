import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  // CREATE: Menambah produk baru
  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Validasi manual
    if (!createProductDto.name || createProductDto.name.trim() === '') {
      throw new BadRequestException('Name is required');
    }
    if (createProductDto.price == null) {
      throw new BadRequestException('Price is required');
    }
    if (createProductDto.price < 0) {
      throw new BadRequestException('Price must be at least 0');
    }
    if (createProductDto.stock !== undefined && createProductDto.stock < 0) {
      throw new BadRequestException('Stock must be at least 0');
    }

    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  // READ: Mendapatkan semua produk
  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  // READ: Mendapatkan produk berdasarkan ID
  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  // READ: Mencari produk berdasarkan nama (search)
  async searchByName(keyword: string): Promise<Product[]> {
    return this.productModel
      .find({
        name: { $regex: keyword, $options: 'i' }, // 'i' = case-insensitive
      })
      .exec();
  }

  // UPDATE: Mengupdate produk berdasarkan ID
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    // Validasi untuk update
    if (updateProductDto.price !== undefined && updateProductDto.price < 0) {
      throw new BadRequestException('Price must be at least 0');
    }
    if (updateProductDto.stock !== undefined && updateProductDto.stock < 0) {
      throw new BadRequestException('Stock must be at least 0');
    }

    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();

    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return updatedProduct;
  }

  // DELETE: Menghapus produk berdasarkan ID
  async delete(id: string): Promise<{ message: string }> {
    const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
    if (!deletedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return { message: `Product with ID ${id} successfully deleted` };
  }
}
