import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { Plus, Trash2, Search, Upload, Camera, Image as ImageIcon } from 'lucide-react'

export default function Estoque({ usuario }) {
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  
  // Estado do formulário
  const [novo, setNovo] = useState({ nome: '', preco: '', custo: '', qtd: '' })
  const [imagem, setImagem] = useState(null) // Arquivo selecionado
  const [preview, setPreview] = useState(null) // URL para mostrar na tela antes de salvar
  const [uploading, setUploading] = useState(false)
  
  const [showForm, setShowForm] = useState(false)
  const isAdmin = usuario.cargo === 'admin'

  useEffect(() => { buscarProdutos() }, [])

  async function buscarProdutos() {
    setLoading(true)
    const { data } = await supabase.from('produtos').select('*').order('id', { ascending: false })
    if (data) setProdutos(data)
    setLoading(false)
  }

  // Função para lidar com a seleção da imagem
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImagem(file)
      setPreview(URL.createObjectURL(file)) // Cria um link temporário para mostrar a foto
    }
  }

  async function salvar(e) {
    e.preventDefault()
    if (!isAdmin) return

    let finalImageUrl = null

    // 1. Se tem imagem, faz o upload primeiro
    if (imagem) {
      setUploading(true)
      const fileName = `${Date.now()}_${imagem.name.replace(/\s/g, '')}`
      
      const { data, error } = await supabase.storage
        .from('produtos')
        .upload(fileName, imagem)

      if (error) {
        alert("Erro ao subir imagem: " + error.message)
        setUploading(false)
        return
      }

      // Pega a URL pública da imagem
      const { data: publicUrlData } = supabase.storage.from('produtos').getPublicUrl(fileName)
      finalImageUrl = publicUrlData.publicUrl
      setUploading(false)
    }

    // 2. Salva no Banco de Dados
    await supabase.from('produtos').insert([{ 
        nome: novo.nome, 
        preco: parseFloat(novo.preco), 
        custo: parseFloat(novo.custo||0), 
        qtd: parseInt(novo.qtd),
        imagem_url: finalImageUrl // Salva o link da foto
    }])

    buscarProdutos()
    setNovo({ nome: '', preco: '', custo: '', qtd: '' })
    setImagem(null)
    setPreview(null)
    setShowForm(false)
  }

  async function excluir(id) {
    if (!confirm("Tem certeza?")) return
    await supabase.from('produtos').delete().eq('id', id)
    buscarProdutos()
  }

  const filtrados = produtos.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()))

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Produtos</h1>
          <p style={{ color: 'var(--text-muted)', margin: '4px 0 0' }}>Gerencie o estoque e fotos.</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            <Plus size={18} /> Novo Produto
          </button>
        )}
      </div>

      {/* Formulário de Cadastro */}
      {showForm && (
        <div className="card" style={{ padding: '20px', marginBottom: '24px', background: '#FAFAFA', borderStyle: 'dashed' }}>
          <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Novo Item</h3>
          <form onSubmit={salvar}>
            
            {/* Área de Upload de Foto */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
              <div style={{ 
                width: '100px', height: '100px', borderRadius: '8px', 
                border: '2px dashed var(--border)', display: 'flex', 
                alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: 'white'
              }}>
                {preview ? (
                  <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <ImageIcon size={30} style={{ color: 'var(--text-muted)' }} />
                )}
              </div>
              <div>
                <label 
                  htmlFor="foto-upload" 
                  className="btn" 
                  style={{ background: 'white', border: '1px solid var(--border)', cursor: 'pointer' }}
                >
                  <Camera size={16} /> Adicionar Foto
                </label>
                <input 
                  id="foto-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  style={{ display: 'none' }} 
                />
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '5px' }}>
                  Tire uma foto ou escolha da galeria.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{fontSize:'12px', fontWeight:'600'}}>Nome</label>
                <input className="input" value={novo.nome} onChange={e => setNovo({...novo, nome: e.target.value})} required />
              </div>
              <div>
                <label style={{fontSize:'12px', fontWeight:'600'}}>Preço</label>
                <input className="input" type="number" value={novo.preco} onChange={e => setNovo({...novo, preco: e.target.value})} required />
              </div>
              <div>
                <label style={{fontSize:'12px', fontWeight:'600'}}>Qtd</label>
                <input className="input" type="number" value={novo.qtd} onChange={e => setNovo({...novo, qtd: e.target.value})} required />
              </div>
              <div>
                <label style={{fontSize:'12px', fontWeight:'600'}}>Custo</label>
                <input className="input" type="number" value={novo.custo} onChange={e => setNovo({...novo, custo: e.target.value})} />
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={uploading} style={{ width: '100%' }}>
              {uploading ? 'Enviando foto...' : 'Salvar Produto'}
            </button>
          </form>
        </div>
      )}

      {/* Tabela de Produtos */}
      <div className="card">
        <div className="card-header">
           <div style={{ position: 'relative', maxWidth: '300px' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: '#9CA3AF' }} />
            <input className="input" placeholder="Buscar..." value={busca} onChange={e => setBusca(e.target.value)} style={{ paddingLeft: '34px' }} />
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Foto</th>
                <th>Produto</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ width: '40px', height: '40px', borderRadius: '6px', overflow: 'hidden', background: '#f3f4f6' }}>
                      {p.imagem_url ? (
                        <img src={p.imagem_url} alt={p.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📷</div>
                      )}
                    </div>
                  </td>
                  <td style={{ fontWeight: '500' }}>{p.nome}</td>
                  <td>R$ {p.preco.toFixed(2)}</td>
                  <td>
                     <span className={`badge ${p.qtd < 5 ? 'badge-danger' : 'badge-success'}`}>{p.qtd}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {isAdmin && (
                      <button className="btn btn-ghost btn-icon" onClick={() => excluir(p.id)} style={{ color: 'var(--danger)' }}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}