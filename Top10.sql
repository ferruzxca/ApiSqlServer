SELECT TOP 10 p.Titulo, COUNT(*) AS Vistas
FROM Visualizaciones v
JOIN Peliculas p ON v.PeliculaID = p.PeliculaID
GROUP BY p.Titulo
ORDER BY Vistas DESC;
