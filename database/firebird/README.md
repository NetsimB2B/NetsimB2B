# Firebird

Bu dizindeki `migrations` yalnızca B2B uygulamasının sahip olduğu nesneleri değiştirir. Netsim çekirdek tablolarına migration uygulanmaz.

Gerçek Netsim veritabanına geçerken:

1. Müşteri kurulumundaki Firebird major/minor sürümünü doğrulayın.
2. Salt-okunur entegrasyon kullanıcısı açın.
3. `NETSIM_TABLE_MAP.md` üzerinden tablo, kolon ve işlem kodlarını doğrulayın.
4. Yazma senaryolarını kopya veritabanında transaction ve Netsim UI karşılaştırmasıyla test edin.
5. Onaylanan yazma akışlarını ayrı gateway sınıflarında tutun.

