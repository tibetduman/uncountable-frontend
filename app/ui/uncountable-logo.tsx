import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';
import logo from '@/app/public/logo.png';

export default function UncountableLogo() {
  return (
    <div className={`${lusitana.className} flex flex-row items-center leading-none text-white`}>
      <Image
        src={logo}
        width={296}
        height={105}
        className="hidden md:block translate-y-5"
        alt="Full size logo for uncountable" />
    </div>
  );
}
