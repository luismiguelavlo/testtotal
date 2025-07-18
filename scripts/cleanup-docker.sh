#!/bin/bash

echo "=== Limpieza de espacio Docker ==="
echo "Fecha: $(date)"
echo ""

echo "Espacio disponible antes de limpiar:"
df -h
echo ""

echo "Uso de espacio Docker antes de limpiar:"
docker system df
echo ""

echo "Limpiando imágenes Docker no utilizadas..."
docker system prune -a -f
echo ""

echo "Limpiando volúmenes no utilizados..."
docker volume prune -f
echo ""

echo "Limpiando redes no utilizadas..."
docker network prune -f
echo ""

echo "Limpiando cache de builder..."
docker builder prune -a -f
echo ""

echo "Espacio disponible después de limpiar:"
df -h
echo ""

echo "Uso de espacio Docker después de limpiar:"
docker system df
echo ""

echo "=== Limpieza completada ===" 