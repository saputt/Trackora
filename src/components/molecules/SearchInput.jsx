import { Search } from 'lucide-react'
import Input from '../atoms/Input'

export default function SearchInput({ value, onChange, placeholder = 'Cari...', className = '' }) {
  return (
    <div className={className}>
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        icon={<Search className="h-4 w-4" />}
      />
    </div>
  )
}
