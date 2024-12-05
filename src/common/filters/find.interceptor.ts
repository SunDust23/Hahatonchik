import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { FindService } from './find.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class FindInterceptor implements NestInterceptor {
  constructor(private readonly universalFindService: FindService,
    private reflector: Reflector
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const model = this.reflector.get('model', context.getHandler());  // Предполагается, что модель передается через request
    const body = request.body;

    // // Получение данных через UniversalFindService на основе фильтра в body
    return from(this.universalFindService.findAll(model, body))
      .pipe(
        switchMap(customData => 
          next.handle().pipe(
            map(originalData => ({
              data: customData.rows,   // Преобразованные данные из сервиса
              total: customData.count, // Общее количество элементов
              originalData                // Оригинальные данные из обработчика
            }))
          )
        )
      );
  }
}
