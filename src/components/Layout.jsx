import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { LayoutDashboard, Package, ShoppingCart, TrendingUp, LogOut, Store, User2 } from 'lucide-react'

export default function Layout({ children, usuario }) {
  const location = useLocation()
  
  const menu = [
    { name: 'Vendas', path: '/', icon: ShoppingCart },
    { name: 'Estoque', path: '/produtos', icon: Package },
    { name: 'Relatórios', path: '/relatorios', icon: TrendingUp },
  ]

  return (
    <div className="layout-container">
      {/* BARRA LATERAL */}
      <aside className="sidebar">
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '8px', color: 'white' }}>
            <Store size={20} />
          </div>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Labelli Moda</span>
        </div>

        <nav style={{ flex: 1, padding: '20px' }}>
          {menu.map(item => {
            const ativo = location.pathname === item.path
            return (
              <Link key={item.path} to={item.path} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px', borderRadius: '8px', marginBottom: '4px',
                textDecoration: 'none',
                background: ativo ? '#F3F4F6' : 'transparent',
                color: ativo ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: ativo ? '600' : '400'
              }}>
                <item.icon size={18} />
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div style={{ padding: '20px', borderTop: '1px solid var(--border)' }}>
          <User2 size={20} />
          <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>  
            {usuario.nome}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: 'px' }}>{usuario.cargo}</div>
          
          <div style={{width: '40px',height: '3px',backgroundColor: 'var(--border)',borderRadius: '2px',marginBottom: '16px'}}/>
          
          <button onClick={() => supabase.auth.signOut()} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', color: '#EF4444' }}>
            <LogOut size={16} /> Sair
          </button>
        </div>
      </aside>

      {/* CONTEÚDO DA PÁGINA */}
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}