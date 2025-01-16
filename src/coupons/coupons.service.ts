import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from './entities/coupon.entity';
import { Repository } from 'typeorm';
import { isAfter } from 'date-fns';

@Injectable()
export class CouponsService {
  
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
  ) {}
  
  async create(createCouponDto: CreateCouponDto) {
    return await this.couponRepository.save(createCouponDto);
  }

  async findAll() {
    return await this.couponRepository.find();
  }

  async findOne(id: number) {
    const coupon = await this.couponRepository.findOneBy({ id });
    if(!coupon) throw new NotFoundException(`Coupon #${id} not found`);
    return coupon;
  }

  async update(id: number, updateCouponDto: UpdateCouponDto) {
    const coupon = await this.findOne(id);
    Object.assign(coupon, updateCouponDto);
    
    return await this.couponRepository.save(coupon);
  }

  async remove(id: number) {
    const coupon = await this.findOne(id);
    await this.couponRepository.remove(coupon);
    return { message: `Coupon #${id} deleted` };
  }
  
  async applyCoupon(couponName: string) {
    const coupon = await this.couponRepository.findOne({where:{ name: couponName }});
    //Coupon Exist and not expired
    if(!coupon) throw new NotFoundException(`Coupon ${couponName} not found`);
    if(isAfter(new Date(), coupon.expirationDate)) throw new UnprocessableEntityException(`Coupon ${couponName} expired`);
    
    //Apply Coupon
    
    
    return { message: `Coupon ${couponName} applied` , ...coupon};
  }
}
