# webext-date-picker — Calendar Date Picker
> **Built by [Zovo](https://zovo.one)** | `npm i webext-date-picker`

Calendar view with month navigation, min/max dates, today highlight, and formatted output.

```typescript
import { DatePicker } from 'webext-date-picker';
const picker = new DatePicker();
picker.setMin(new Date('2024-01-01')).setMax(new Date('2025-12-31'));
picker.mount('date-container', (date) => console.log(DatePicker.format(date)));
```
MIT License
