'use client';

import { useState, useEffect } from 'react';
import { backendUrl } from "@/utils/config";
import { Document } from "@/types/document";

export default function DocumentsPage() {
  const [year, setYear] = useState<number>(2024); 
  const [month, setMonth] = useState<number>(3);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async (y: number, m: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(backendUrl(`/documents/${y}/${m}`));
      
      if (!res.ok) {
        throw new Error(`Документ не найден`);
      }

      const data = await res.json();
      setDocuments(data);
    } catch (err: any) {
      setError(err.message || 'Не удалось загрузить документы');
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments(year, month);
  }, [year, month]);

  
  const handlePrint = () => {
    window.print();
  };

  
  const getStatusBadge = (made: number) => {
    return made === 1 
      ? <span style={{ color: 'green', fontWeight: 'bold' }}>Выполнено</span> 
      : <span style={{ color: 'orange' }}>В обработке</span>;
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif', color: '#333' }}>
      
      {}
      <style>{`
        @media print {
          /* Чистим поля и убираем дефолтную дату/URL с краев листа */
          @page {
            size: auto;
            margin: 15mm 10mm 15mm 10mm;
          }
          
          body {
            background-color: #fff !important;
            color: #000 !important;
            padding: 0 !important;
          }

          /* Скрываем шапку сайта (header) и панель управления (фильтры/кнопку) */
          header, .no-print {
            display: none !important;
          }

          /* Растягиваем таблицу на весь лист */
          table {
            width: 100% !important;
            border-collapse: collapse !important;
            border: 1px solid #000 !important;
          }

          th, td {
            border: 1px solid #ccc !important;
            padding: 8px !important;
            font-size: 10pt !important;
          }

          th {
            background-color: #f8f9fa !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          /* Убеждаемся, что код комментариев не будет иметь серый фон на бумаге */
          code {
            background: transparent !important;
            padding: 0 !important;
            font-style: italic;
          }
        }
      `}</style>

      <h1 style={{ marginBottom: '20px' }}>Архив документов / Заявки</h1>

      {/* Панель управления (скроется при печати) */}
      <div className="no-print" style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div>
          <label style={{ marginRight: '8px', fontWeight: 'bold' }}>Год:</label>
          <select 
            value={year} 
            onChange={(e) => setYear(Number(e.target.value))}
            style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value={2016}>2016</option>
            <option value={2017}>2017</option>
            <option value={2018}>2018</option>
            <option value={2019}>2019</option>
            <option value={2020}>2020</option>
            <option value={2021}>2021</option>
            <option value={2022}>2022</option>
            <option value={2023}>2023</option>
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
          </select>
        </div>

        <div>
          <label style={{ marginRight: '8px', fontWeight: 'bold' }}>Месяц:</label>
          <select 
            value={month} 
            onChange={(e) => setMonth(Number(e.target.value))}
            style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {m.toString().padStart(2, '0')}
              </option>
            ))}
          </select>
        </div>

        {/* Кнопка Печати */}
        <button
          onClick={handlePrint}
          disabled={documents.length === 0 || loading}
          style={{
            padding: '7px 16px',
            backgroundColor: documents.length === 0 || loading ? '#a0aec0' : '#319795',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: documents.length === 0 || loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
          }}
        >
          🖨️ Распечатать отчет
        </button>
      </div>

      {loading && <p>Загрузка данных...</p>}
      {error && <p style={{ color: 'red' }}>⚠️ {error}</p>}

      {!loading && !error && documents.length === 0 && (
        <p style={{ color: '#666' }}>За выбранный период документов не найдено.</p>
      )}

      {}
      {!loading && documents.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table border={1} cellPadding={10} style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'left', borderColor: '#ddd' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th>ID</th>
                <th>Отправитель</th>
                <th>Получатель</th>
                <th>Ресурс</th>
                <th>Кол-во</th>
                <th>Формат / Коммент</th>
                <th>Дата подачи</th>
                <th>Дата выполнения</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ fontWeight: 'bold' }}>{doc.id}</td>
                  <td>Пользователь #{doc.idUser}</td>
                  <td>Пользователь #{doc.idReceiver}</td>
                  <td>Ресурс {doc.idResource}</td>
                  <td>{doc.amount ?? 0}</td>
                  <td>
                    <code style={{ background: '#eee', padding: '2px 6px', borderRadius: '4px' }}>
                      {doc.comment || '—'}
                    </code>
                  </td>
                  <td>{new Date(doc.dateFirst).toLocaleString('ru-RU')}</td>
                  <td>{doc.dateVyp ? new Date(doc.dateVyp).toLocaleString('ru-RU') : '—'}</td>
                  <td>{getStatusBadge(doc.made)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}