'use client';
import { useState, useEffect, useCallback, ReactNode, MouseEvent } from 'react';

interface Props {
  children: ReactNode;
}

export default function ContextMenuWrapper({ children } : Props) {
  const [menu, setMenu] = useState({ visible: false, x: 0, y: 0 });

  // Обработчик открытия меню
  const handleContextMenu = (e : MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setMenu({ visible: true, x: e.clientX, y: e.clientY });
  };

  // Скрытие меню при клике в любом другом месте
  const handleClick = useCallback(() => {
    if (menu.visible) setMenu({ visible: false, x: 0, y: 0 });
  }, [menu.visible]);

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [handleClick]);

  return (
    <div onContextMenu={handleContextMenu} style={{ minHeight: '100vh' }}>
      {children}
      
      {menu.visible && (
        <div
          style={{
            position: 'fixed',
            top: menu.y,
            left: menu.x,
            zIndex: 1000,
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '10px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
        >
          <ul>
            <li onClick={() => console.log('Действие 1')}>Действие 1</li>
            <li onClick={() => console.log('Действие 2')}>Действие 2</li>
          </ul>
        </div>
      )}
    </div>
  );
}