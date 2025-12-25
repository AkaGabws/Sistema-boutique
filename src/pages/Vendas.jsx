import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { Search, ShoppingCart, Plus, Minus } from 'lucide-react'

export default function Vendas({ usuario }) {
  const [produtos, setProdutos] = useState([])
  const [carrinho, setCarrinho] = useState([])
  const [busca, setBusca] = useState('')
  const [pagamento, setPagamento] = useState('pix')
  const [processando, setProcessando] = useState(false)

  useEffect(() => { buscarProdutos() }, [])

  async function buscarProdutos() {
    const { data } = await supabase.from('produtos').select('*').gt('qtd', 0).order('nome')
    if (data) setProdutos(data)
  }

  const adicionar = (p) => {
    const existe = carrinho.find(item => item.id === p.id)
    if (existe) {
      if (existe.carrinhoQtd >= p.qtd) return alert("Estoque máximo atingido!")
      setCarrinho(carrinho.map(item => item.id === p.id ? {...item, carrinhoQtd: item.carrinhoQtd + 1} : item))
    } else {
      setCarrinho([...carrinho, { ...p, carrinhoQtd: 1 }])
    }
  }

  const remover = (id) => {
    const existe = carrinho.find(item => item.id === id)
    if (existe.carrinhoQtd > 1) {
      setCarrinho(carrinho.map(item => item.id === id ? {...item, carrinhoQtd: item.carrinhoQtd - 1} : item))
    } else {
      setCarrinho(carrinho.filter(item => item.id !== id))
    }
  }

  const totalCarrinho = carrinho.reduce((acc, item) => acc + (item.preco * item.carrinhoQtd), 0)

  const finalizarVenda = async () => {
    if (carrinho.length === 0) return alert("Carrinho vazio!")
    if (!confirm(`Confirmar venda de R$ ${totalCarrinho.toFixed(2)} no ${pagamento.toUpperCase()}?`)) return

    setProcessando(true)

    const { data: venda, error } = await supabase.from('vendas').insert([{
      vendedor_id: usuario.id,
      total: totalCarrinho,
      pagamento: pagamento
    }]).select().single()

    if (error) {
      alert("Erro ao criar venda")
      setProcessando(false)
      return
    }

    for (const item of carrinho) {
      await supabase.from('venda_itens').insert([{
        venda_id: venda.id,
        produto_id: item.id,
        qtd: item.carrinhoQtd,
        preco_unitario: item.preco
      }])

      const novaQtd = item.qtd - item.carrinhoQtd
      await supabase.from('produtos').update({ qtd: novaQtd }).eq('id', item.id)
    }

    alert("Venda realizada com sucesso! 🎉")
    setCarrinho([])
    buscarProdutos()
    setProcessando(false)
  }

  const prodFiltrados = produtos.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()))

  return (
    // USANDO A NOVA CLASSE CSS AQUI
    <div className="vendas-container">
      
      {/* LADO ESQUERDO: Catálogo de Produtos */}
      <div style={{ flex: 1 }}>
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} />
          <input 
            className="input" 
            placeholder="Buscar produto..." 
            value={busca} 
            onChange={e => setBusca(e.target.value)} 
            style={{ paddingLeft: '38px' }} 
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
          {prodFiltrados.map(p => (
            <div key={p.id} className="card" onClick={() => !processando && adicionar(p)} style={{ cursor: 'pointer', transition: 'transform 0.1s' }}>
              <div style={{ height: '120px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {p.imagem_url ? (
                  <img src={p.imagem_url} alt={p.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <ShoppingCart size={30} color="#cbd5e1" />
                )}
              </div>
              <div style={{ padding: '10px' }}>
                <div style={{ fontWeight: '600', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.nome}</div>
                <div style={{ color: 'var(--primary)', fontWeight: 'bold' }}>R$ {p.preco.toFixed(2)}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Estoque: {p.qtd}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LADO DIREITO: Carrinho e Pagamento */}
      {/* USANDO A NOVA CLASSE CSS AQUI TAMBÉM */}
      <div className="card cart-card">
        <div className="card-header" style={{ background: 'var(--primary)', color: 'white' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingCart size={20} /> Carrinho
          </h3>
        </div>

        <div className="card-body">
          <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
            {carrinho.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#9ca3af', padding: '20px 0' }}>Carrinho vazio</div>
            ) : (
              carrinho.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' }}>
                  <div style={{flex: 1}}>
                    <div style={{ fontWeight: '500', fontSize: '14px' }}>{item.nome}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>R$ {item.preco} x {item.carrinhoQtd}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button onClick={() => remover(item.id)} className="btn btn-ghost" style={{ padding: '4px', height: '28px', width: '28px' }}><Minus size={14}/></button>
                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{item.carrinhoQtd}</span>
                    <button onClick={() => adicionar(item)} className="btn btn-ghost" style={{ padding: '4px', height: '28px', width: '28px' }}><Plus size={14}/></button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>PAGAMENTO</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '15px' }}>
              {['pix', 'dinheiro', 'credito', 'debito'].map(tipo => (
                <button
                  key={tipo}
                  onClick={() => setPagamento(tipo)}
                  style={{
                    padding: '8px',
                    borderRadius: '6px',
                    border: pagamento === tipo ? '2px solid var(--primary)' : '1px solid var(--border)',
                    background: pagamento === tipo ? 'white' : '#f3f4f6',
                    color: pagamento === tipo ? 'var(--primary)' : '#6b7280',
                    fontWeight: '600',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    cursor: 'pointer'
                  }}
                >
                  {tipo}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', fontSize: '18px', fontWeight: 'bold' }}>
              <span>Total</span>
              <span>R$ {totalCarrinho.toFixed(2)}</span>
            </div>
            
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '12px', fontSize: '16px' }}
              onClick={finalizarVenda}
              disabled={processando || carrinho.length === 0}
            >
              {processando ? 'Processando...' : 'Finalizar Venda'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}