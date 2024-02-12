'use client';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function DatePickerComponent({ placeholder }: { placeholder: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
  
    function handleChange(term: Dayjs | null) {
      const params = new URLSearchParams(searchParams);
      if (term) {
        params.set('date', term.toString());
        params.set('index', '0');
      } else {
        params.delete('date');
      }
      replace(`${pathname}?${params.toString()}`);
    }
    return (
        <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                defaultValue={dayjs(placeholder)}
                views={['year', 'month', 'day']}
                value={dayjs(placeholder)}
                onChange={(newValue) => handleChange(newValue)}
                />
            </LocalizationProvider>
</div>
    )
}
