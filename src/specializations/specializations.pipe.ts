import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class SpecializationsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body' && typeof value === 'object') {
      // Преобразуем поля value и url в нижний регистр
      if (value.value) {
        value.value = value.value.toLowerCase();
      }
      if (value.url) {
        // Преобразуем URL в нижний регистр
        const url = value.url.toLowerCase();

        // Проверяем, что URL состоит только из латинских букв, цифр и дефисов и не содержит пробелов
        const urlRegex = /^[a-z0-9\-]+$/;
        if (!urlRegex.test(url)) {
          throw new BadRequestException(
            'URL должен содержать только латинские буквы, цифры и дефисы, и не содержать пробелов',
          );
        }

        value.url = url;
      }
    }

    return value;
  }
}
