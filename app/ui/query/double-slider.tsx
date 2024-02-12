import ReactSlider from 'react-slider';
import './slider-styles.css';
import { Restriction } from "@/app/lib/restriction";
import { MinusCircleIcon } from '@heroicons/react/24/outline';
import { truncateToFirstDecimal } from '@/app/lib/utils';

interface DoubleSliderProps {
    onRemove: () => void;
    restriction: Restriction;
    onChange: (values: number[]) => void;
}

export const DoubleSlider = ({onRemove, onChange, restriction }: DoubleSliderProps) => {
    return (
        <div className={`slider ${restriction.parameterType} grid grid-cols-10 gap-4 items-center my-4 rounded-md h-20`}>
            <div className='col-span-1'>
                <button className="rounded-md p-2 hover:bg-gray-100 m-2" onClick={onRemove}>
                <span className="sr-only"></span>
                <MinusCircleIcon className="w-7" />
            </button>
            </div>
            <div className='col-span-3 text-white font-medium'> {restriction.name}</div>
            <div className='col-span-5'>
                <ReactSlider
                    className="horizontal-slider w-full"
                    thumbClassName="example-thumb h-6 w-6 rounded-full shadow-lg cursor-grab"
                    trackClassName="example-track bg-black h-2"
                    onChange={onChange}
                    defaultValue={[restriction.currentMinValue, restriction.currentMaxValue]}
                    max={restriction.absoluteMax}
                    min={restriction.absoluteMin}
                    step={(restriction.absoluteMax-restriction.absoluteMin) / 100}
                    ariaLabel={['Lower thumb', 'Upper thumb']}
                    ariaValuetext={state => `Thumb value ${truncateToFirstDecimal(state.valueNow)}`}
                    renderThumb={(props, state) => (
                        <div 
                            {...props}
                            className="example-thumb h-6 w-6 rounded-full shadow-lg cursor-grab flex items-center justify-center">
                            {truncateToFirstDecimal(state.valueNow)}
                        </div>
                    )}
                    renderTrack={(props, state) => (
                        <div
                            {...props}
                            className={`${state.index === 1 ? 'bg-black' : 'bg-slate-500'} example-track`}
                        />
                    )}
                />
            </div>
            <div className='col-span-1 text-white font-medium'>{restriction.parameterType}</div>
        </div>
    );
};