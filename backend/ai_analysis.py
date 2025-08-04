
def analyze_data(data):
    try:
        total = sum(item["miktar"] for item in data)
        categories = {item["kategori"]: item["miktar"] for item in data}
        return {
            "toplam": total,
            "kategoriler": categories,
            "yorum": "Veri analizi başarılı"
        }
    except Exception as e:
        return {"error": str(e)}
