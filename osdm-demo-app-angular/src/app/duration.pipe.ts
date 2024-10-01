import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
  standalone: true
})
export class DurationPipe implements PipeTransform {
  transform(value: string): string {
    const match = value.match(/PT(\d+H)?(\d+M)?/);
    if (!match) return value;

    const hours = match[1] ? match[1].replace('H', '') : '0';
    const minutes = match[2] ? match[2].replace('M', '') : '0';

    return `${hours}h ${minutes}m`;
  }
}
