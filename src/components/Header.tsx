import React from 'react'

interface HeaderProps {
  children?: React.ReactNode
}

function Header({ children }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 h-14 flex items-center justify-between px-4 shadow-sm">
      <h1 className="text-xl font-bold text-gray-800">
        微信公众号文章编辑器
      </h1>
      {children}
    </header>
  )
}

export default Header
