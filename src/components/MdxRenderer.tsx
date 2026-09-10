import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { ThemeImage } from './ThemeImage'; // We'll create this

const components = {
  h1: (props: any) => <h1 className="text-4xl md:text-5xl font-black font-['Outfit'] text-black dark:text-white mt-12 mb-6" {...props} />,
  h2: (props: any) => <h2 className="text-3xl font-bold font-['Outfit'] text-black dark:text-white mt-10 mb-4 border-b border-black/5 dark:border-white/5 pb-2" {...props} />,
  h3: (props: any) => <h3 className="text-2xl font-bold font-['Outfit'] text-black dark:text-white mt-8 mb-4" {...props} />,
  p: (props: any) => <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6" {...props} />,
  ul: (props: any) => <ul className="space-y-3 mb-6" {...props} />,
  li: (props: any) => (
    <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
      <span>{props.children}</span>
    </li>
  ),
  a: (props: any) => {
    const href = props.href;
    if (href?.startsWith('/')) {
      return <Link href={href} className="text-red-600 dark:text-red-400 font-bold hover:underline" {...props} />;
    }
    return <a target="_blank" rel="noopener noreferrer" className="text-red-600 dark:text-red-400 font-bold hover:underline" {...props} />;
  },
  img: (props: any) => (
    <div className="my-10 rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-2xl">
      <img className="w-full h-auto object-cover" {...props} />
    </div>
  ),
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-red-600 pl-6 py-2 my-8 bg-red-50/50 dark:bg-red-900/10 italic text-gray-700 dark:text-gray-300 rounded-r-xl" {...props} />
  ),
  Screenshot: (props: any) => <ThemeImage light={props.light} dark={props.dark} alt={props.alt} />,
  FAQ: ({ question, answer }: { question: string, answer: string }) => (
    <details className="group bg-gray-50 dark:bg-[#111115] border border-gray-200 dark:border-white/10 rounded-2xl cursor-pointer mb-4">
      <summary className="flex items-center justify-between font-bold p-6 text-lg list-none">
        {question}
        <span className="transition group-open:rotate-180">
          <svg fill="none" height="24" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
        </span>
      </summary>
      <div className="px-6 pb-6 text-gray-600 dark:text-gray-400 text-lg">
        {answer}
      </div>
    </details>
  )
};

export function MdxRenderer({ source }: { source: string }) {
  return (
    <div className="mdx-content">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
