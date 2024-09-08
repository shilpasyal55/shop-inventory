import { IsString, IsInt, IsOptional, IsNumber, Min, IsNotEmpty } from 'class-validator';

export class CreateInventoryDto {
    @IsString()
    @IsNotEmpty()
    productName: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsInt()
    @Min(1)
    totalQty: number;

    @IsNumber()
    @Min(1) // Adjusted to allow zero price if needed
    price: number;
}
