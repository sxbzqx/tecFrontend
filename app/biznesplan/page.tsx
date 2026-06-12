"use client";

import { useState, useEffect } from "react";
import { backendUrl } from "@/utils/config";
import { Biznesplan } from "@/types/biznesplan";

export default function BusinessPlansList() {
  const [plans, setPlans] = useState<Biznesplan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");

  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log(`Запрос отправлен на ${backendUrl("/biznesplan")}`); 

        const response = await fetch(backendUrl("/biznesplan"));
        console.log("Ответ от сервера получен, статус:", response.status); 

        if (!response.ok) {
          throw new Error(`Сервер ответил с ошибкой: ${response.status}`);
        }

        const data: Biznesplan[] = await response.json();
        console.log("Данные успешно распарсены:", data); 
        setPlans(data);
      } catch (err: any) {
        console.error("Критическая ошибка при fetch:", err); 
        setError(err.message || "Не удалось загрузить бизнес-планы");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedYear, selectedType]);

  
  const uniqueYears = Array.from(
    new Set(plans.map((p) => p.year.trim()))
  ).filter(Boolean).sort((a, b) => b.localeCompare(a));

  
  const uniqueTypes = Array.from(
    new Set(plans.map((p) => p.typeBp.trim()))
  ).filter(Boolean).sort();

  
  const filteredPlans = plans.filter((plan) => {
    const matchesSearch = plan.comment
      ? plan.comment.toLowerCase().includes(searchQuery.toLowerCase())
      : searchQuery === "";

    const matchesYear = selectedYear
      ? plan.year.trim() === selectedYear
      : true;

    const matchesType = selectedType
      ? plan.typeBp.trim() === selectedType
      : true;

    return matchesSearch && matchesYear && matchesType;
  });

  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  
  const currentPlans = filteredPlans.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);

  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (isLoading) return <div style={{ padding: "20px" }}>Загрузка бизнес-планов...</div>;
  if (error)
    return <div style={{ padding: "20px", color: "red" }}>Ошибка: {error}</div>;

  return (
    <div
      style={{
        padding: "24px",
        fontFamily: "sans-serif",
        backgroundColor: "#f4f6f8",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ marginBottom: "24px", color: "#333", fontSize: "24px" }}>
        Реестр бизнес-планов
      </h1>

      {/* Панель фильтров */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "24px",
          flexWrap: "wrap",
          backgroundColor: "#fff",
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        {/* Поиск по комментарию */}
        <div style={{ flex: "1", minWidth: "260px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            Поиск по комментарию:
          </label>
          <input
            type="text"
            placeholder="Введите часть комментария..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Фильтр по Году */}
        <div style={{ minWidth: "150px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            Год:
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "14px",
              backgroundColor: "#fff",
              height: "41px",
            }}
          >
            <option value="">Все года</option>
            {uniqueYears.map((year) => (
              <option key={year} value={year}>
                {year} год
              </option>
            ))}
          </select>
        </div>

        {}
        <div style={{ minWidth: "150px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            Тип БП:
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "14px",
              backgroundColor: "#fff",
              height: "41px",
            }}
          >
            <option value="">Все типы</option>
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>
                Тип {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p style={{ marginBottom: "16px", color: "#666", fontSize: "14px" }}>
        Найдено планов: <strong>{filteredPlans.length}</strong>
        {totalPages > 1 && ` (Страница ${currentPage} из ${totalPages})`}
      </p>

      {}
      {currentPlans.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            color: "#666",
          }}
        >
          Бизнес-планы не найдены
        </div>
      ) : (
        <>
          <div
            style={{
              width: "100%",
              overflowX: "auto",
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              border: "1px solid #eef0f2",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
                fontSize: "14px",
                minWidth: "800px",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#f8f9fa",
                    borderBottom: "2px solid #eaeaea",
                  }}
                >
                  <th style={{ padding: "14px 16px", fontWeight: "600", color: "#444", width: "70px" }}>
                    ID
                  </th>
                  <th style={{ padding: "14px 16px", fontWeight: "600", color: "#444", width: "100px" }}>
                    Год
                  </th>
                  <th style={{ padding: "14px 16px", fontWeight: "600", color: "#444", width: "90px" }}>
                    Вариант
                  </th>
                  <th style={{ padding: "14px 16px", fontWeight: "600", color: "#444", width: "100px" }}>
                    Тип БП
                  </th>
                  <th style={{ padding: "14px 16px", fontWeight: "600", color: "#444", width: "120px" }}>
                    Статус
                  </th>
                  <th style={{ padding: "14px 16px", fontWeight: "600", color: "#444" }}>
                    Комментарий
                  </th>
                  <th style={{ padding: "14px 16px", fontWeight: "600", color: "#444", width: "160px" }}>
                    Дата создания
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentPlans.map((plan, index) => (
                  <tr
                    key={plan.id}
                    style={{
                      borderBottom: "1px solid #f0f0f0",
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#fbfbfc",
                    }}
                  >
                    <td style={{ padding: "12px 16px", color: "#666", fontWeight: "500" }}>
                      {plan.id}
                    </td>
                    <td style={{ padding: "12px 16px", fontWeight: "600", color: "#111" }}>
                      {plan.year}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#333" }}>
                      <span
                        style={{
                          backgroundColor: "#f0f4f8",
                          color: "#334e68",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        v{plan.variant}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#444" }}>
                      Код {plan.typeBp}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {plan.main === "1" ? (
                        <span
                          style={{
                            backgroundColor: "#e6fffa",
                            color: "#006d5b",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "600",
                            display: "inline-block",
                          }}
                        >
                          Основной
                        </span>
                      ) : (
                        <span
                          style={{
                            backgroundColor: "#f5f5f5",
                            color: "#777",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            display: "inline-block",
                          }}
                        >
                          Альтернативный
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#222", fontStyle: plan.comment ? "normal" : "italic" }}>
                      {plan.comment || "Без комментария"}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#666", whiteSpace: "nowrap" }}>
                      {formatDate(plan.datecreate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {}
          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                marginTop: "24px",
                flexWrap: "wrap",
              }}
            >
              {}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  backgroundColor: currentPage === 1 ? "#e0e0e0" : "#fff",
                  color: currentPage === 1 ? "#888" : "#333",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  fontSize: "14px",
                }}
              >
                Назад
              </button>

              {/* Умная генерация номеров страниц */}
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;
                const isFirstPage = pageNumber === 1;
                const isLastPage = pageNumber === totalPages;
                const isWithinRange = Math.abs(pageNumber - currentPage) <= 1;

                if (isFirstPage || isLastPage || isWithinRange) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "6px",
                        border: "1px solid",
                        borderColor: currentPage === pageNumber ? "#0d47a1" : "#ccc",
                        backgroundColor: currentPage === pageNumber ? "#0d47a1" : "#fff",
                        color: currentPage === pageNumber ? "#fff" : "#333",
                        fontWeight: currentPage === pageNumber ? "bold" : "normal",
                        cursor: "pointer",
                        minWidth: "40px",
                        fontSize: "14px",
                      }}
                    >
                      {pageNumber}
                    </button>
                  );
                }

                if (
                  (pageNumber === 2 && currentPage > 3) ||
                  (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                ) {
                  return (
                    <span
                      key={pageNumber}
                      style={{ padding: "0 4px", color: "#666" }}
                    >
                      ...
                    </span>
                  );
                }

                return null;
              })}

              {/* Кнопка "Вперед" */}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  backgroundColor: currentPage === totalPages ? "#e0e0e0" : "#fff",
                  color: currentPage === totalPages ? "#888" : "#333",
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                  fontSize: "14px",
                }}
              >
                Вперед
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}