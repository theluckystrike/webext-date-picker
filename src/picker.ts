/**
 * Date Picker — Calendar date selection component
 */
export class DatePicker {
    private selected: Date | null = null;
    private viewing: Date;
    private container: HTMLElement | null = null;
    private onChange: ((date: Date) => void) | null = null;
    private minDate: Date | null = null;
    private maxDate: Date | null = null;

    constructor() { this.viewing = new Date(); }

    /** Set min selectable date */
    setMin(date: Date): this { this.minDate = date; return this; }
    /** Set max selectable date */
    setMax(date: Date): this { this.maxDate = date; return this; }

    /** Mount to container */
    mount(containerId: string, onChange?: (date: Date) => void): this {
        this.container = document.getElementById(containerId);
        if (onChange) this.onChange = onChange;
        this.render();
        return this;
    }

    /** Get selected date */
    getSelected(): Date | null { return this.selected; }

    /** Set selected date */
    setSelected(date: Date): this { this.selected = date; this.viewing = new Date(date); this.render(); return this; }

    /** Format date */
    static format(date: Date, fmt: string = 'YYYY-MM-DD'): string {
        const y = date.getFullYear(); const m = date.getMonth() + 1; const d = date.getDate();
        return fmt.replace('YYYY', String(y)).replace('MM', String(m).padStart(2, '0')).replace('DD', String(d).padStart(2, '0'));
    }

    /** Render calendar */
    private render(): void {
        if (!this.container) return;
        const year = this.viewing.getFullYear(); const month = this.viewing.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        let cells = '';
        for (let i = 0; i < firstDay; i++) cells += `<div style="width:36px;height:36px"></div>`;
        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(year, month, d);
            const isSelected = this.selected && date.toDateString() === this.selected.toDateString();
            const isToday = date.toDateString() === new Date().toDateString();
            const disabled = (this.minDate && date < this.minDate) || (this.maxDate && date > this.maxDate);
            const bg = isSelected ? '#3B82F6' : isToday ? '#EBF5FF' : 'transparent';
            const color = isSelected ? '#fff' : disabled ? '#D1D5DB' : '#1F2937';
            const cursor = disabled ? 'default' : 'pointer';
            cells += `<div style="width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:${bg};color:${color};cursor:${cursor};font-size:14px" ${disabled ? '' : `data-day="${d}"`}>${d}</div>`;
        }

        this.container.innerHTML = `
      <div style="font-family:-apple-system,sans-serif;width:280px;border:1px solid #E5E7EB;border-radius:12px;padding:16px;background:#fff;box-shadow:0 4px 12px rgba(0,0,0,0.08)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <button style="border:none;background:none;cursor:pointer;font-size:18px;padding:4px 8px;color:#6B7280" data-nav="prev">&#8249;</button>
          <span style="font-weight:600;font-size:15px">${monthNames[month]} ${year}</span>
          <button style="border:none;background:none;cursor:pointer;font-size:18px;padding:4px 8px;color:#6B7280" data-nav="next">&#8250;</button>
        </div>
        <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;text-align:center;margin-bottom:4px">
          ${['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => `<div style="font-size:12px;color:#9CA3AF;font-weight:500;padding:4px">${d}</div>`).join('')}
        </div>
        <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px">${cells}</div>
      </div>`;

        this.container.querySelector('[data-nav="prev"]')?.addEventListener('click', () => { this.viewing.setMonth(this.viewing.getMonth() - 1); this.render(); });
        this.container.querySelector('[data-nav="next"]')?.addEventListener('click', () => { this.viewing.setMonth(this.viewing.getMonth() + 1); this.render(); });
        this.container.querySelectorAll('[data-day]').forEach((el) => {
            el.addEventListener('click', () => {
                const day = Number((el as HTMLElement).dataset.day);
                this.selected = new Date(year, month, day);
                this.onChange?.(this.selected);
                this.render();
            });
        });
    }
}
