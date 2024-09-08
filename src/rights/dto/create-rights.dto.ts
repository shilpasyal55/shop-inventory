import { IsInt, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateRightsDto {
    @IsInt()
    @IsNotEmpty()
    userId: number;

    @IsBoolean()
    view: boolean;

    @IsBoolean()
    edit: boolean;
}
