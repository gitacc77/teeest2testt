/*
 * Crypto Analysis Assistant
 *
 * Smart cryptocurrency analysis with AI power.
 *
 * @author    https://github.com/imotb
 * @version   1.0.0
 * @license   MIT
 */
class CryptoAnalyzer {
    constructor() {
        this.apiKey = '';
        this.selectedModel = '';
        this.selectedCrypto = '';
        this.analysisType = 'short';
        this.cryptoData = {};
        this.cryptoInfo = {};
        this.currentLanguage = 'fa'; // زبان پیش‌فرض فارسی
        this.translations = this.getTranslations();
        this.initializeEventListeners();
        this.applyLanguage();
    }

    // تابع برای تعریف ترجمه‌ها
    getTranslations() {
        return {
            'fa': {
                'title': 'تحلیل هوشمند ارزهای دیجیتال',
                'subtitle': 'تحلیل ارزهای دیجیتال با قدرت هوش مصنوعی',
                'settings': 'تنظیمات تحلیل',
                'apiKeyLabel': 'کلید API OpenRouter:',
                'apiKeyPlaceholder': 'کلید API خود را وارد کنید',
                'apiKeyHelp': 'کلید API خود را از openrouter.ai دریافت کنید',
                'modelLabel': 'مدل هوش مصنوعی:',
                'cryptoLabel': 'ارز دیجیتال:',
                'analysisTypeLabel': 'نوع تحلیل:',
                'analysisTypeShort': 'تحلیل کوتاه مدت',
                'analysisTypeLong': 'تحلیل بلند مدت',
                'analyzeButton': 'شروع تحلیل هوشمند',
                'resultsTitle': 'نتایج تحلیل',
                'loadingText': 'در حال دریافت داده‌های لحظه‌ای...',
                'cryptoInfoTitle': 'اطلاعات ارز (لحظه‌ای)',
                'summaryTitle': 'خلاصه تحلیل',
                'liveChartTitle': 'نمودار زنده',
                'indicatorsTitle': 'شاخص‌های تکنیکال (محاسبه شده)',
                'levelsTitle': 'سطوح حمایت و مقاومت',
                'volumeProfileTitle': 'پروفایل حجم',
                'fibonacciTitle': 'سطوح بازگشت فیبوناچی',
                'recommendationTitle': 'پیشنهاد معاملاتی',
                'fullAnalysisTitle': 'تحلیل کامل هوش مصنوعی',
                'copyButton': 'کپی نتایج',
                'downloadButton': 'دانلود PDF',
                'shareButton': 'اشتراک گذاری'
            },
            'en': {
                'title': 'Crypto Analysis Assistant',
                'subtitle': 'Smart cryptocurrency analysis with AI power',
                'settings': 'Analysis Settings',
                'apiKeyLabel': 'OpenRouter API Key:',
                'apiKeyPlaceholder': 'Enter your API key',
                'apiKeyHelp': 'Get your API key from openrouter.ai',
                'modelLabel': 'AI Model:',
                'cryptoLabel': 'Cryptocurrency:',
                'analysisTypeLabel': 'Analysis Type:',
                'analysisTypeShort': 'Short-term Analysis',
                'analysisTypeLong': 'Long-term Analysis',
                'analyzeButton': 'Start Smart Analysis',
                'resultsTitle': 'Analysis Results',
                'loadingText': 'Fetching real-time data...',
                'cryptoInfoTitle': 'Currency Info (Live)',
                'summaryTitle': 'Analysis Summary',
                'liveChartTitle': 'Live Chart',
                'indicatorsTitle': 'Technical Indicators (Calculated)',
                'levelsTitle': 'Support & Resistance Levels',
                'volumeProfileTitle': 'Volume Profile',
                'fibonacciTitle': 'Fibonacci Retracement Levels',
                'recommendationTitle': 'Trading Recommendation',
                'fullAnalysisTitle': 'Full AI Analysis',
                'copyButton': 'Copy Results',
                'downloadButton': 'Download PDF',
                'shareButton': 'Share'
            }
        };
    }

    // تابع برای اعمال زبان انتخاب شده
    applyLanguage() {
        // تغییر متن دکمه زبان
        document.getElementById('langTextSubtitle').textContent = 
            this.currentLanguage === 'fa' ? 'English' : 'فارسی';
        
        // تغییر جهت صفحه
        document.body.setAttribute('dir', this.currentLanguage === 'fa' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', this.currentLanguage);
        
        // اعمال ترجمه‌ها
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (this.translations[this.currentLanguage][key]) {
                element.textContent = this.translations[this.currentLanguage][key];
            }
        });
        
        // اعمال ترجمه برای placeholderها
        const placeholders = document.querySelectorAll('[data-translate-placeholder]');
        placeholders.forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            if (this.translations[this.currentLanguage][key]) {
                element.setAttribute('placeholder', this.translations[this.currentLanguage][key]);
            }
        });
    }

    // تابع جدید برای فرمت‌بندی اعداد بسیار کوچک
    formatSmallNumber(num, maxDecimals = 10) {
        if (num === 0) return '0';
        if (num >= 0.01) {
            return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 });
        }
        if (num >= 0.0001) {
            return num.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 8 });
        }
        
        // برای اعداد بسیار کوچک مثل شیبا و پپه
        const fixedNum = num.toFixed(maxDecimals);
        // حذف صفرهای انتهایی
        return fixedNum.replace(/\.?0+$/, '');
    }

    // تابع جدید برای فرمت‌بندی قیمت بر اساس نوع ارز
    formatPrice(price, symbol) {
        // لیست ارزهایی که قیمت بسیار پایینی دارند
        const lowPriceCryptos = ['SHIB', 'PEPE', 'DOGE', 'XLM'];
        
        if (lowPriceCryptos.includes(symbol)) {
            if (price < 0.0001) {
                return price.toFixed(8);
            } else if (price < 0.01) {
                return price.toFixed(6);
            }
        }
        
        if (price < 1) {
            return price.toFixed(4);
        }
        
        return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 });
    }

    // تابع جدید برای فرمت‌بندی اعداد در محاسبات
    formatCalculationNumber(num) {
        if (num === 0) return 0;
        if (Math.abs(num) < 0.000001) {
            return parseFloat(num.toFixed(10));
        }
        if (Math.abs(num) < 0.001) {
            return parseFloat(num.toFixed(8));
        }
        if (Math.abs(num) < 0.1) {
            return parseFloat(num.toFixed(6));
        }
        return parseFloat(num.toFixed(4));
    }

    initializeEventListeners() {
    document.getElementById('analyzeBtn').addEventListener('click', () => this.startAnalysis());
    document.getElementById('copyBtn').addEventListener('click', () => this.copyResults());
    document.getElementById('downloadBtn').addEventListener('click', () => this.downloadPDF());
    document.getElementById('shareBtn').addEventListener('click', () => this.shareResults());
    
    // اضافه کردن event listener برای تغییر زبان
    document.getElementById('langToggleSubtitle').addEventListener('click', () => {
        this.currentLanguage = this.currentLanguage === 'fa' ? 'en' : 'fa';
        this.applyLanguage();
    });
    
        // Initialize Select2 for cryptocurrency dropdown
        $('#cryptocurrency').select2({
            templateResult: this.formatCryptoOption,
            templateSelection: this.formatCryptoSelection,
            width: '100%'
        });
        
        // Initialize Select2 for AI model dropdown
        $('#model').select2({
            templateResult: this.formatAIModelOption,
            templateSelection: this.formatAIModelSelection,
            width: '100%'
        });
    }

    // Add these new methods to format options with icons
    formatCryptoOption(option) {
        if (!option.id) {
            return option.text;
        }
        
        const iconUrl = $(option.element).data('icon');
        if (!iconUrl) {
            return option.text;
        }
        
        const $option = $(
            '<span><img src="' + iconUrl + '" class="crypto-icon" /> ' + option.text + '</span>'
        );
        return $option;
    }

    formatCryptoSelection(option) {
        if (!option.id) {
            return option.text;
        }
        
        const iconUrl = $(option.element).data('icon');
        if (!iconUrl) {
            return option.text;
        }
        
        const $option = $(
            '<span><img src="' + iconUrl + '" class="crypto-icon-selection" /> ' + option.text + '</span>'
        );
        return $option;
    }

    formatAIModelOption(option) {
        if (!option.id) {
            return option.text;
        }
        
        const iconUrl = $(option.element).data('icon');
        if (!iconUrl) {
            return option.text;
        }
        
        const $option = $(
            '<span><img src="' + iconUrl + '" class="ai-icon" /> ' + option.text + '</span>'
        );
        return $option;
    }

    formatAIModelSelection(option) {
        if (!option.id) {
            return option.text;
        }
        
        const iconUrl = $(option.element).data('icon');
        if (!iconUrl) {
            return option.text;
        }
        
        const $option = $(
            '<span><img src="' + iconUrl + '" class="ai-icon-selection" /> ' + option.text + '</span>'
        );
        return $option;
    }

    async startAnalysis() {
        // دریافت تنظیمات
        this.apiKey = document.getElementById('apiKey').value;
        this.selectedModel = document.getElementById('model').value;
        this.selectedCrypto = document.getElementById('cryptocurrency').value;
        this.analysisType = document.querySelector('input[name="analysisType"]:checked').value;

        // اعتبارسنجی
        if (!this.apiKey) {
            this.showError(this.currentLanguage === 'fa' ? 
                'لطفاً کلید API OpenRouter خود را وارد کنید' : 
                'Please enter your OpenRouter API key');
            return;
        }

        // نمایش پنل نتایج
        document.getElementById('resultsPanel').style.display = 'block';
        document.getElementById('analysisStatus').style.display = 'block';
        document.getElementById('analysisResults').style.display = 'none';

        try {
            // به‌روزرسانی وضعیت
            this.updateStatus(this.currentLanguage === 'fa' ? 
                'در حال دریافت اطلاعات ارز...' : 
                'Fetching currency information...');
            
            // دریافت اطلاعات ارز
            await this.fetchCryptoInfo();
            
            // به‌روزرسانی وضعیت
            this.updateStatus(this.currentLanguage === 'fa' ? 
                'در حال دریافت داده‌های لحظه‌ای...' : 
                'Fetching real-time data...');
            
            // دریافت داده‌های واقعی از API های عمومی
            await this.fetchRealTimeData();
            
            // به‌روزرسانی وضعیت
            this.updateStatus(this.currentLanguage === 'fa' ? 
                'در حال محاسبه شاخص‌های تکنیکال...' : 
                'Calculating technical indicators...');
            
            // محاسبه شاخص‌های تکنیکال
            await this.calculateTechnicalIndicators();
            
            // به‌روزرسانی وضعیت
            this.updateStatus(this.currentLanguage === 'fa' ? 
                'در حال دریافت شاخص ترس و طمع...' : 
                'Fetching fear & greed index...');
            
            // دریافت شاخص ترس و طمع
            await this.fetchFearGreedIndex();
            
            // به‌روزرسانی وضعیت
            this.updateStatus(this.currentLanguage === 'fa' ? 
                'در حال تحلیل هوشمند...' : 
                'Performing AI analysis...');
            
            // تحلیل هوشمند
            const analysis = await this.performAIAnalysis();
            
            // نمایش نتایج
            this.displayResults(analysis);
            
        } catch (error) {
            console.error('Error:', error);
            this.showError(this.currentLanguage === 'fa' ? 
                'خطا در انجام تحلیل: ' + error.message : 
                'Analysis error: ' + error.message);
        }
    }

    updateStatus(message) {
        const loadingText = document.querySelector('.loading p');
        if (loadingText) {
            loadingText.textContent = message;
        }
    }

    async fetchCryptoInfo() {
        // اطلاعات پایه ارزها
        const cryptoInfoDatabase = {
            bitcoin: { symbol: 'BTC', name: this.currentLanguage === 'fa' ? 'بیت کوین' : 'Bitcoin', coingeckoId: 'bitcoin', coinpaprikaId: 'btc-bitcoin', tradingViewSymbol: 'BINANCE:BTCUSDT' },
            ethereum: { symbol: 'ETH', name: this.currentLanguage === 'fa' ? 'اتریوم' : 'Ethereum', coingeckoId: 'ethereum', coinpaprikaId: 'eth-ethereum', tradingViewSymbol: 'BINANCE:ETHUSDT' },
            binancecoin: { symbol: 'BNB', name: this.currentLanguage === 'fa' ? 'بایننس کوین' : 'Binance Coin', coingeckoId: 'binancecoin', coinpaprikaId: 'bnb-bnb', tradingViewSymbol: 'BINANCE:BNBUSDT' },
            ripple: { symbol: 'XRP', name: this.currentLanguage === 'fa' ? 'ریپل' : 'Ripple', coingeckoId: 'ripple', coinpaprikaId: 'xrp-xrp', tradingViewSymbol: 'BINANCE:XRPUSDT' },
            solana: { symbol: 'SOL', name: this.currentLanguage === 'fa' ? 'سولانا' : 'Solana', coingeckoId: 'solana', coinpaprikaId: 'sol-solana', tradingViewSymbol: 'BINANCE:SOLUSDT' },
            cardano: { symbol: 'ADA', name: this.currentLanguage === 'fa' ? 'کاردانو' : 'Cardano', coingeckoId: 'cardano', coinpaprikaId: 'ada-cardano', tradingViewSymbol: 'BINANCE:ADAUSDT' },
            dogecoin: { symbol: 'DOGE', name: this.currentLanguage === 'fa' ? 'دوج کوین' : 'Dogecoin', coingeckoId: 'dogecoin', coinpaprikaId: 'doge-dogecoin', tradingViewSymbol: 'BINANCE:DOGEUSDT' },
            tron: { symbol: 'TRX', name: this.currentLanguage === 'fa' ? 'ترون' : 'Tron', coingeckoId: 'tron', coinpaprikaId: 'trx-tron', tradingViewSymbol: 'BINANCE:TRXUSDT' },
            polkadot: { symbol: 'DOT', name: this.currentLanguage === 'fa' ? 'پولکادات' : 'Polkadot', coingeckoId: 'polkadot', coinpaprikaId: 'dot-polkadot', tradingViewSymbol: 'BINANCE:DOTUSDT' },
            polygon: { symbol: 'MATIC', name: this.currentLanguage === 'fa' ? 'پالیگان' : 'Polygon', coingeckoId: 'matic-network', coinpaprikaId: 'matic-polygon', tradingViewSymbol: 'BINANCE:POLUSDT' },
            litecoin: { symbol: 'LTC', name: this.currentLanguage === 'fa' ? 'لایت کوین' : 'Litecoin', coingeckoId: 'litecoin', coinpaprikaId: 'ltc-litecoin', tradingViewSymbol: 'BINANCE:LTCUSDT' },
            chainlink: { symbol: 'LINK', name: this.currentLanguage === 'fa' ? 'چین لینک' : 'Chainlink', coingeckoId: 'chainlink', coinpaprikaId: 'link-chainlink', tradingViewSymbol: 'BINANCE:LINKUSDT' },
            'bitcoin-cash': { symbol: 'BCH', name: this.currentLanguage === 'fa' ? 'بیت کوین کش' : 'Bitcoin Cash', coingeckoId: 'bitcoin-cash', coinpaprikaId: 'bch-bitcoin-cash', tradingViewSymbol: 'BINANCE:BCHUSDT' },
            'ethereum-classic': { symbol: 'ETC', name: this.currentLanguage === 'fa' ? 'اتریوم کلاسیک' : 'Ethereum Classic', coingeckoId: 'ethereum-classic', coinpaprikaId: 'etc-ethereum-classic', tradingViewSymbol: 'BINANCE:ETCUSDT' },
            stellar: { symbol: 'XLM', name: this.currentLanguage === 'fa' ? 'استلار' : 'Stellar', coingeckoId: 'stellar', coinpaprikaId: 'xlm-stellar', tradingViewSymbol: 'BINANCE:XLMUSDT' },
            uniswap: { symbol: 'UNI', name: this.currentLanguage === 'fa' ? 'یونی‌سواپ' : 'Uniswap', coingeckoId: 'uniswap', coinpaprikaId: 'uni-uniswap', tradingViewSymbol: 'BINANCE:UNIUSDT' },
            toncoin: { symbol: 'TON', name: this.currentLanguage === 'fa' ? 'تون کوین' : 'Toncoin', coingeckoId: 'the-open-network', coinpaprikaId: 'ton-toncoin', tradingViewSymbol: 'BINANCE:TONUSDT' },
            'avalanche-2': { symbol: 'AVAX', name: this.currentLanguage === 'fa' ? 'آوالانچ' : 'Avalanche', coingeckoId: 'avalanche-2', coinpaprikaId: 'avax-avalanche', tradingViewSymbol: 'BINANCE:AVAXUSDT' },
            'shiba-inu': { symbol: 'SHIB', name: this.currentLanguage === 'fa' ? 'شیبا اینو' : 'Shiba Inu', coingeckoId: 'shiba-inu', coinpaprikaId: 'shib-shiba-inu', tradingViewSymbol: 'BINANCE:SHIBUSDT' },
            monero: { symbol: 'XMR', name: this.currentLanguage === 'fa' ? 'مونرو' : 'Monero', coingeckoId: 'monero', coinpaprikaId: 'xmr-monero', tradingViewSymbol: 'KUCOIN:XMRUSDT' },
            'vechain': { symbol: 'VET', name: this.currentLanguage === 'fa' ? 'وی چین' : 'VeChain', coingeckoId: 'vechain', coinpaprikaId: 'vet-vechain', tradingViewSymbol: 'BINANCE:VETUSDT' },
            'cosmos-hub': { symbol: 'ATOM', name: this.currentLanguage === 'fa' ? 'کازماس' : 'Cosmos', coingeckoId: 'cosmos', coinpaprikaId: 'atom-cosmos', tradingViewSymbol: 'BINANCE:ATOMUSDT' },
            'tezos': { symbol: 'XTZ', name: this.currentLanguage === 'fa' ? 'تزوس' : 'Tezos', coingeckoId: 'tezos', coinpaprikaId: 'xtz-tezos', tradingViewSymbol: 'BINANCE:XTZUSDT' },
            'leo-token': { symbol: 'LEO', name: this.currentLanguage === 'fa' ? 'لئو توکن' : 'LEO Token', coingeckoId: 'leo-token', coinpaprikaId: 'leo-leo-token', tradingViewSymbol: 'OKX:LEOUSDT' },
            'kucoin-shares': { symbol: 'KCS', name: this.currentLanguage === 'fa' ? 'کوکوین توکن' : 'KuCoin', coingeckoId: 'kucoin-shares', coinpaprikaId: 'kcs-kucoin-token', tradingViewSymbol: 'KUCOIN:KCSUSDT' },
            'zcash': { symbol: 'ZEC', name: this.currentLanguage === 'fa' ? 'زی کش' : 'Zcash', coingeckoId: 'zcash', coinpaprikaId: 'zec-zcash', tradingViewSymbol: 'BINANCE:ZECUSDT' },
            'pax-gold': { symbol: 'PAXG', name: this.currentLanguage === 'fa' ? 'پکس گلد' : 'PAX Gold', coingeckoId: 'pax-gold', coinpaprikaId: 'paxg-pax-gold', tradingViewSymbol: 'BINANCE:PAXGUSDT' },
            'tether-gold': { symbol: 'XAUT', name: this.currentLanguage === 'fa' ? 'تتر گلد' : 'Tether Gold', coingeckoId: 'tether-gold', coinpaprikaId: 'xaut-tether-gold', tradingViewSymbol: 'XAUTUSDT' },
            'chiliz': { symbol: 'CHZ', name: this.currentLanguage === 'fa' ? 'چیلیز' : 'Chiliz', coingeckoId: 'chiliz', coinpaprikaId: 'chz-chiliz', tradingViewSymbol: 'BINANCE:CHZUSDT' },
            'the-sandbox': { symbol: 'SAND', name: this.currentLanguage === 'fa' ? 'سندباکس' : 'The Sandbox', coingeckoId: 'the-sandbox', coinpaprikaId: 'sand-the-sandbox', tradingViewSymbol: 'BINANCE:SANDUSDT' },
            'near': { symbol: 'NEAR', name: this.currentLanguage === 'fa' ? 'نیر پروتکل' : 'NEAR Protocol', coingeckoId: 'near', coinpaprikaId: 'near-near-protocol', tradingViewSymbol: 'BINANCE:NEARUSDT' },
            'sui': { symbol: 'SUI', name: this.currentLanguage === 'fa' ? 'سویی' : 'Sui', coingeckoId: 'sui', coinpaprikaId: 'sui-sui', tradingViewSymbol: 'BINANCE:SUIUSDT' },
            'render-token': { symbol: 'RENDER', name: this.currentLanguage === 'fa' ? 'رندر توکن' : 'Render', coingeckoId: 'render-token', coinpaprikaId: 'render-render', tradingViewSymbol: 'BINANCE:RENDERUSDT' },
            'injective-protocol': { symbol: 'INJ', name: this.currentLanguage === 'fa' ? 'اینجکتیو' : 'Injective', coingeckoId: 'injective-protocol', coinpaprikaId: 'inj-injective-protocol', tradingViewSymbol: 'BINANCE:INJUSDT' },
            'stacks': { symbol: 'STX', name: this.currentLanguage === 'fa' ? 'استکس' : 'Stacks', coingeckoId: 'blockstack', coinpaprikaId: 'stx-stacks', tradingViewSymbol: 'BINANCE:STXUSDT' },
            'celestia': { symbol: 'TIA', name: this.currentLanguage === 'fa' ? 'سلستیا' : 'Celestia', coingeckoId: 'celestia', coinpaprikaId: 'tia-celestia', tradingViewSymbol: 'OKX:TIAUSDT' },
            'floki': { symbol: 'FLOKI', name: this.currentLanguage === 'fa' ? 'فلوکی' : 'FLOKI', coingeckoId: 'floki', coinpaprikaId: 'floki-floki-inu', tradingViewSymbol: 'BINANCE:FLOKIUSDT' },
            'baby-doge-coin': { symbol: 'BABYDOGE', name: this.currentLanguage === 'fa' ? 'بیبی دوج' : 'Baby Doge Coin', coingeckoId: 'baby-doge-coin', coinpaprikaId: 'babydoge-baby-doge-coin', tradingViewSymbol: 'OKX:BABYDOGEUSDT' },
            'wanchain': { symbol: 'WAN', name: this.currentLanguage === 'fa' ? 'ون چین' : 'Wanchain', coingeckoId: 'wanchain', coinpaprikaId: 'wan-wanchain', tradingViewSymbol: 'BINANCE:WANUSDT' },
            electroneum: { symbol: 'ETN', name: this.currentLanguage === 'fa' ? 'الکترونیوم' : 'Electroneum', coingeckoId: 'electroneum', coinpaprikaId: 'etn-electroneum', tradingViewSymbol: 'KUCOIN:ETNUSDT' },
            'trust-wallet-token': { symbol: 'TWT', name: this.currentLanguage === 'fa' ? 'تراست ولت توکن' : 'Trust Wallet Token', coingeckoId: 'trust-wallet-token', coinpaprikaId: 'twt-trust-wallet-token', tradingViewSymbol: 'BINANCE:TWTUSDT' },
            'pepe': { symbol: 'PEPE', name: this.currentLanguage === 'fa' ? 'پپه' : 'Pepe', coingeckoId: 'pepe', coinpaprikaId: 'pepe-pepe', tradingViewSymbol: 'BINANCE:PEPEUSDT' },
            'dogs': { symbol: 'DOGS ', name: this.currentLanguage === 'fa' ? 'داگز' : 'Dogs', coingeckoId: 'dogs-2', coinpaprikaId: 'dogs-dogs', tradingViewSymbol: 'BINANCE:DOGSUSDT' },
            'sonic': { symbol: 'S', name: this.currentLanguage === 'fa' ? 'سونیک' : 'Sonic', coingeckoId: 'sonic-3', coinpaprikaId: 's-sonic', tradingViewSymbol: 'COINEX:SUSDT' },
            'hyperliquid': { symbol: 'HYPE', name: this.currentLanguage === 'fa' ? 'هایپر لیکویید' : 'Hyperliquid', coingeckoId: 'hyperliquid', coinpaprikaId: 'hype-hyperliquid', tradingViewSymbol: 'KUCOIN:HYPEUSDT' },
            'pump-fun': { symbol: 'PUMP', name: this.currentLanguage === 'fa' ? 'پامپ فان' : 'Pump.fun', coingeckoId: 'pump-fun', coinpaprikaId: 'pump-pumpfun', tradingViewSymbol: 'BYBIT:PUMPUSDT' },
            kusama: { symbol: 'KSM', name: this.currentLanguage === 'fa' ? 'کوزاما' : 'Kusama', coingeckoId: 'kusama', coinpaprikaId: 'ksm-kusama', tradingViewSymbol: 'OKX:KSMUSDT' },
            aave: { symbol: 'AAVE', name: this.currentLanguage === 'fa' ? 'آوه' : 'Aave', coingeckoId: 'aave', coinpaprikaId: 'aave-new', tradingViewSymbol: 'BINANCE:AAVEUSDT' },
            aptos: { symbol: 'APT', name: this.currentLanguage === 'fa' ? 'آپتوس' : 'Aptos', coingeckoId: 'aptos', coinpaprikaId: 'apt-aptos', tradingViewSymbol: 'OKX:APTUSDT' },
            'apex-token-2': { symbol: 'APEX', name: this.currentLanguage === 'fa' ? 'اپکس پروتکل' : 'ApeX Protocol', coingeckoId: 'apex-token-2', coinpaprikaId: 'apxp-apex-protocol', tradingViewSymbol: 'BYBIT:APEXUSDT' },
            okb: { symbol: 'OKB', name: this.currentLanguage === 'fa' ? 'او کی بی' : 'OKB', coingeckoId: 'okb', coinpaprikaId: 'okb-okb', tradingViewSymbol: 'OKX:OKBUSDT' },
            notcoin: { symbol: 'NOT', name: this.currentLanguage === 'fa' ? 'نات کوین' : 'Notcoin', coingeckoId: 'notcoin', coinpaprikaId: 'not-notcoin', tradingViewSymbol: 'OKX:NOTUSDT' },
            optimism: { symbol: 'OP', name: this.currentLanguage === 'fa' ? 'اپتیمیزم' : 'Optimism', coingeckoId: 'optimism', coinpaprikaId: 'op-optimism', tradingViewSymbol: 'OKX:OPUSDT' },
            decentraland: { symbol: 'MANA', name: this.currentLanguage === 'fa' ? 'دیسنترالند' : 'Decentraland', coingeckoId: 'decentraland', coinpaprikaId: 'mana-decentraland', tradingViewSymbol: 'BINANCE:MANAUSDT' },
            'internet-computer': { symbol: 'ICP', name: this.currentLanguage === 'fa' ? 'اینترنت کامپیوتر' : 'Internet Computer', coingeckoId: 'internet-computer', coinpaprikaId: 'icp-internet-computer', tradingViewSymbol: 'COINBASE:ICPUSDT' },
            'curve-dao-token': { symbol: 'CRV', name: this.currentLanguage === 'fa' ? 'کرو دائو' : 'Curve DAO', coingeckoId: 'curve-dao-token', coinpaprikaId: 'crv-curve-dao-token', tradingViewSymbol: 'OKX:CRVUSDT' },
            zora: { symbol: 'ZORA', name: this.currentLanguage === 'fa' ? 'زورا' : 'Zora', coingeckoId: 'zora', coinpaprikaId: 'zora-zora', tradingViewSymbol: 'KUCOIN:ZORAUSDT' },
            'ondo-finance': { symbol: 'ONDO', name: this.currentLanguage === 'fa' ? 'اوندو' : 'Ondo', coingeckoId: 'ondo-finance', coinpaprikaId: 'ondo-ondo', tradingViewSymbol: 'KUCOIN:ONDOUSDT' },
            'aster-2': { symbol: 'ASTER', name: this.currentLanguage === 'fa' ? 'آستار' : 'Aster', coingeckoId: 'aster-2', coinpaprikaId: 'aster-aster', tradingViewSymbol: 'MEXC:ASTERUSDT' },
            arbitrum: { symbol: 'ARB', name: this.currentLanguage === 'fa' ? 'آربیتروم' : 'Arbitrum', coingeckoId: 'arbitrum', coinpaprikaId: 'arb-arbitrum', tradingViewSymbol: 'KUCOIN:ARBUSDT' },
            'pancakeswap-token': { symbol: 'CAKE', name: this.currentLanguage === 'fa' ? 'پنکیک سواپ' : 'PancakeSwap', coingeckoId: 'pancakeswap-token', coinpaprikaId: 'cake-pancakeswap', tradingViewSymbol: 'CRYPTO:CAKEUSD' },
            bittensor: { symbol: 'TAO', name: this.currentLanguage === 'fa' ? 'بیتنسور' : 'Bittensor', coingeckoId: 'bittensor', coinpaprikaId: 'tao-bittensor', tradingViewSymbol: 'MEXC:TAOUSDT' },
            'story-2': { symbol: 'IP', name: this.currentLanguage === 'fa' ? 'استوری' : 'Story', coingeckoId: 'story-2', coinpaprikaId: 'ip-story', tradingViewSymbol: 'MEXC:IPUSDT' },
            'binance-staked-sol': { symbol: 'BNSOL', name: this.currentLanguage === 'fa' ? 'بایننس استیکد سول' : 'Binance Staked SOL', coingeckoId: 'binance-staked-sol', coinpaprikaId: 'bnsol-binance-staked-sol', tradingViewSymbol: 'BINANCE:BNSOLUSDT' },
            sky: { symbol: 'SKY', name: this.currentLanguage === 'fa' ? 'اسکای' : 'Sky', coingeckoId: 'sky', coinpaprikaId: 'sky-sky', tradingViewSymbol: 'OKX:SKYUSDT' },
            'official-trump': { symbol: 'TRUMP', name: this.currentLanguage === 'fa' ? 'آفیشال ترامپ' : 'Official Trump', coingeckoId: 'official-trump', coinpaprikaId: 'sky-trump-official-trump', tradingViewSymbol: 'MEXC:TRUMPUSDT' },
            sushi: { symbol: 'SUSHI', name: this.currentLanguage === 'fa' ? 'سوشی' : 'Sushi', coingeckoId: 'sushi', coinpaprikaId: 'sushi-sushi', tradingViewSymbol: 'BINANCE:SUSHIUSDT' },
            harmony: { symbol: 'ONE', name: this.currentLanguage === 'fa' ? 'هارمونی' : 'Harmony', coingeckoId: 'harmony', coinpaprikaId: 'one-harmony', tradingViewSymbol: 'BINANCE:ONEUSDT' },
            bonk: { symbol: 'BONK', name: this.currentLanguage === 'fa' ? 'بونک' : 'Bonk', coingeckoId: 'bonk', coinpaprikaId: 'bonk-bonk', tradingViewSymbol: 'BINANCE:BONKUSDT' },
            neo: { symbol: 'NEO', name: this.currentLanguage === 'fa' ? 'نئو' : 'NEO', coingeckoId: 'neo', coinpaprikaId: 'neo-neo', tradingViewSymbol: 'BINANCE:NEOUSDT' },
            plasma: { symbol: 'XPL', name: this.currentLanguage === 'fa' ? 'پلاسما' : 'Plasma', coingeckoId: 'plasma', coinpaprikaId: 'xpl-plasma', tradingViewSymbol: 'MEXC:XPLUSDT' },
            'pudgy-penguins': { symbol: 'PENGU', name: this.currentLanguage === 'fa' ? 'پاجی پنگوئن' : 'Pudgy Penguins', coingeckoId: 'pudgy-penguins', coinpaprikaId: 'pengu-pudgy-penguins', tradingViewSymbol: 'MEXC:PENGUUSDT' },
            jasmycoin: { symbol: 'JASMY', name: this.currentLanguage === 'fa' ? 'جسمی کوین' : 'JasmyCoin', coingeckoId: 'jasmycoin', coinpaprikaId: 'jasmy-jasmycoin', tradingViewSymbol: 'BINANCE:JASMYUSDT' },
            'cheems-token': { symbol: 'CHEEMS', name: this.currentLanguage === 'fa' ? 'چیمز' : 'Cheems Token', coingeckoId: 'cheems-token', coinpaprikaId: 'cheems-cheems-cheemspet', tradingViewSymbol: 'MEXC:CHEEMSUSDT' },
            linea: { symbol: 'LINEA', name: this.currentLanguage === 'fa' ? 'لینیا' : 'Linea', coingeckoId: 'linea', coinpaprikaId: 'linea-linea', tradingViewSymbol: 'BINANCE:LINEAUSDT' },
            mitosis: { symbol: 'MITO', name: this.currentLanguage === 'fa' ? 'میتوسیس' : 'Mitosis', coingeckoId: 'mitosis', coinpaprikaId: 'mito-mitosis', tradingViewSymbol: 'BINANCE:MITOUSDT' },
            'pyth-network': { symbol: 'PYTH', name: this.currentLanguage === 'fa' ? 'پایت نتورک' : 'Pyth Network', coingeckoId: 'pyth-network', coinpaprikaId: 'pyth-pyth-network', tradingViewSymbol: 'BINANCE:PYTHUSDT' },
            'starknet': { symbol: 'STRK', name: this.currentLanguage === 'fa' ? 'استارک نت' : 'Starknet', coingeckoId: 'starknet', coinpaprikaId: 'strk-starknet', tradingViewSymbol: 'BINANCE:STRKUSDT' },
        };

        this.cryptoInfo = cryptoInfoDatabase[this.selectedCrypto] || cryptoInfoDatabase.bitcoin;
        console.log('Selected crypto info:', this.cryptoInfo);
    }

    async fetchRealTimeData() {
        try {
            // ابتدا تلاش برای دریافت داده‌ها از CoinGecko API (همیشه در دسترس)
            const geckoData = await this.fetchFromCoinGecko();
            
            // سپس تلاش برای دریافت داده‌های تکمیلی از CoinPaprika (در صورت امکان)
            try {
                const paprikaData = await this.fetchFromCoinPaprika();
                
                // ادغام داده‌ها
                this.cryptoData = {
                    ...geckoData,
                    // اگر داده‌های CoinPaprika در دسترس بود، از آن‌ها استفاده کن
                    exchangeData: paprikaData.exchangeData || geckoData.exchangeData,
                    circulatingSupply: paprikaData.circulatingSupply || geckoData.circulatingSupply,
                    maxSupply: paprikaData.maxSupply || geckoData.maxSupply,
                };
            } catch (paprikaError) {
                console.warn('Could not fetch data from CoinPaprika, using CoinGecko data only:', paprikaError.message);
                this.cryptoData = geckoData;
            }

            console.log('Real-time data fetched:', this.cryptoData);

        } catch (error) {
            console.error('Error fetching real-time data:', error);
            throw new Error('خطا در دریافت داده‌های لحظه‌ای');
        }
    }

    // تابع جدید برای دریافت داده‌ها از CoinGecko
    async fetchFromCoinGecko() {
        try {
            // دریافت داده‌های لحظه‌ای از CoinGecko API
            const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${this.cryptoInfo.coingeckoId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`);
            
            if (!response.ok) {
                throw new Error('خطا در دریافت داده‌ها از CoinGecko');
            }

            const data = await response.json();
            const cryptoData = data[this.cryptoInfo.coingeckoId];

            if (!cryptoData) {
                throw new Error('داده‌های ارز یافت نشد');
            }

            // دریافت داده‌های تاریخی برای محاسبات تکنیکال
            const historicalData = await this.fetchHistoricalDataFromCoinGecko();

            return {
                symbol: this.cryptoInfo.symbol,
                name: this.cryptoInfo.name,
                price: cryptoData.usd,
                priceChange24h: cryptoData.usd_24h_change || 0,
                volume24h: cryptoData.usd_24h_vol || 0,
                marketCap: cryptoData.usd_market_cap || 0,
                historicalData: historicalData,
                exchangeData: [], // CoinGecko این اطلاعات را ارائه نمی‌دهد
                circulatingSupply: null, // نیاز به API جداگانه دارد
                maxSupply: null, // نیاز به API جداگانه دارد
                lastUpdated: Date.now()
            };

        } catch (error) {
            console.error('Error fetching from CoinGecko:', error);
            throw error;
        }
    }

    // تابع جدید برای دریافت داده‌ها از CoinPaprika (با مدیریت خطا)
    async fetchFromCoinPaprika() {
        try {
            // دریافت داده‌های لحظه‌ای از CoinPaprika API
            const response = await fetch(`https://api.coinpaprika.com/v1/tickers/${this.cryptoInfo.coinpaprikaId}`);
            
            if (!response.ok) {
                throw new Error('خطا در دریافت داده‌ها از CoinPaprika');
            }

            const data = await response.json();
            
            // دریافت داده‌های صرافی‌ها
            let exchangeData = [];
            try {
                const exchangeResponse = await fetch(`https://api.coinpaprika.com/v1/coins/${this.cryptoInfo.coinpaprikaId}/exchanges`);
                if (exchangeResponse.ok) {
                    const exchanges = await exchangeResponse.json();
                    exchangeData = exchanges.slice(0, 10).map(exchange => ({
                        name: exchange.name,
                        pair: exchange.pair,
                        volume: exchange.quotes.USD.volume_24h,
                        price: exchange.quotes.USD.price
                    }));
                }
            } catch (exchangeError) {
                console.warn('Could not fetch exchange data from CoinPaprika:', exchangeError.message);
            }

            return {
                exchangeData: exchangeData,
                circulatingSupply: data.circulating_supply,
                maxSupply: data.max_supply
            };

        } catch (error) {
            console.error('Error fetching from CoinPaprika:', error);
            throw error;
        }
    }

    // تابع جدید برای دریافت داده‌های تاریخی از CoinGecko
    async fetchHistoricalDataFromCoinGecko() {
        try {
            // دریافت داده‌های تاریخی 30 روزه از CoinGecko
            const endDate = Math.floor(Date.now() / 1000);
            const startDate = endDate - (30 * 24 * 60 * 60); // 30 روز قبل

            const response = await fetch(`https://api.coingecko.com/api/v3/coins/${this.cryptoInfo.coingeckoId}/market_chart/range?vs_currency=usd&from=${startDate}&to=${endDate}`);
            
            if (!response.ok) {
                throw new Error('خطا در دریافت داده‌های تاریخی');
            }

            const data = await response.json();
            
            // تبدیل داده‌ها به فرمت مورد نیاز با OHLC
            const ohlcData = [];
            
            // تبدیل داده‌های قیمت به فرمت OHLC
            for (let i = 0; i < data.prices.length; i++) {
                const timestamp = data.prices[i][0];
                const price = data.prices[i][1];
                const volume = data.total_volumes[i] ? data.total_volumes[i][1] : 0;
                
                // برای سادگی، از قیمت به عنوان Open, High, Low, Close استفاده می‌کنیم
                // در یک پیاده‌سازی واقعی، باید از API دیگری که داده‌های OHLC واقعی ارائه می‌دهد استفاده کرد
                ohlcData.push({
                    date: new Date(timestamp).toISOString().split('T')[0],
                    open: price,
                    high: price * 1.02, // شبیه‌سازی 2% نوسان
                    low: price * 0.98,  // شبیه‌سازی 2% نوسان
                    close: price,
                    volume: volume
                });
            }
            
            return ohlcData;

        } catch (error) {
            console.error('Error fetching historical data:', error);
            // در صورت خطا، داده‌های شبیه‌سازی شده برمی‌گردانیم
            return this.generateSimulatedHistoricalData();
        }
    }

    async fetchHistoricalData() {
        try {
            // دریافت داده‌های تاریخی 30 روزه از CoinGecko
            const endDate = Math.floor(Date.now() / 1000);
            const startDate = endDate - (30 * 24 * 60 * 60); // 30 روز قبل

            const response = await fetch(`https://api.coingecko.com/api/v3/coins/${this.cryptoInfo.coingeckoId}/market_chart/range?vs_currency=usd&from=${startDate}&to=${endDate}`);
            
            if (!response.ok) {
                throw new Error('خطا در دریافت داده‌های تاریخی');
            }

            const data = await response.json();
            
            // تبدیل داده‌ها به فرمت مورد نیاز
            return data.prices.map((price, index) => ({
                date: new Date(price[0]).toISOString().split('T')[0],
                price: price[1],
                volume: data.total_volumes[index] ? data.total_volumes[index][1] : 0
            }));

        } catch (error) {
            console.error('Error fetching historical data:', error);
            // در صورت خطا، داده‌های شبیه‌سازی شده برمی‌گردانیم
            return this.generateSimulatedHistoricalData();
        }
    }

    generateSimulatedHistoricalData() {
        const data = [];
        const basePrice = this.cryptoData.price || 100;
        const endDate = new Date();
        
        // تولید داده‌های شبیه‌سازی شده با نوسانات واقعی‌تر
        let currentPrice = basePrice * 0.95; // شروع از 5% پایین‌تر
        
        for (let i = 29; i >= 0; i--) {
            const date = new Date(endDate);
            date.setDate(date.getDate() - i);
            
            // شبیه‌سازی نوسانات قیمت با روند کلی صعودی
            const trendFactor = 1 + (0.01 * (29 - i) / 29); // روند صعودی تدریجی
            const randomChange = (Math.random() - 0.48) * 0.08; // کمی تمایل به صعودی
            const price = currentPrice * (1 + randomChange) * trendFactor;
            
            // محاسبه OHLC بر اساس قیمت
            const volatility = price * 0.03; // 3% نوسان
            const open = currentPrice;
            const close = price;
            const high = Math.max(open, close) + (Math.random() * volatility);
            const low = Math.min(open, close) - (Math.random() * volatility);
            
            data.push({
                date: date.toISOString().split('T')[0],
                open: open,
                high: high,
                low: low,
                close: close,
                volume: Math.random() * 1000000000 + 500000000 // حجم معاملات تصادفی
            });
            
            currentPrice = price;
        }
        
        return data;
    }

    async calculateTechnicalIndicators() {
        // اطمینان از وجود داده‌های تاریخی
        if (!this.cryptoData.historicalData || this.cryptoData.historicalData.length === 0) {
            console.warn('No historical data available, generating simulated data');
            this.cryptoData.historicalData = this.generateSimulatedHistoricalData();
        }
        
        const closes = this.cryptoData.historicalData.map(d => d.close);
        const volumes = this.cryptoData.historicalData.map(d => d.volume || 0);
        const highs = this.cryptoData.historicalData.map(d => d.high);
        const lows = this.cryptoData.historicalData.map(d => d.low);
        const opens = this.cryptoData.historicalData.map(d => d.open);
        
        // محاسبه اندیکاتورهای اصلی
        this.cryptoData.technicalIndicators = {
            rsi: this.calculateRSI(closes),
            macd: this.calculateMACD(closes),
            sma20: this.calculateSMA(closes, 20),
            sma50: this.calculateSMA(closes, 50),
            ema12: this.calculateEMA(closes, 12),
            ema26: this.calculateEMA(closes, 26),
            // اندیکاتورهای جدید
            bollingerBands: this.calculateBollingerBands(closes),
            stochastic: this.calculateStochastic(highs, lows, closes),
            adx: this.calculateADX(highs, lows, closes),
            atr: this.calculateATR(highs, lows, closes),
            obv: this.calculateOBV(closes, volumes),
            vwap: this.calculateVWAP(closes, volumes),
            ichimoku: this.calculateIchimoku(highs, lows, closes),
            fibonacci: this.calculateFibonacciRetracement(closes),
            volumeProfile: this.calculateVolumeProfile(closes, volumes)
        };

        // محاسبه سطوح حمایت و مقاومت با تفکیک زمانی
        this.cryptoData.supportLevelsShort = this.calculateSupportLevels(closes, 'short');
        this.cryptoData.resistanceLevelsShort = this.calculateResistanceLevels(closes, 'short');
        this.cryptoData.supportLevelsLong = this.calculateSupportLevels(closes, 'long');
        this.cryptoData.resistanceLevelsLong = this.calculateResistanceLevels(closes, 'long');

        console.log('Technical indicators calculated:', this.cryptoData.technicalIndicators);
    }

    // تابع جدید برای محاسبه باندهای بولینگر
    calculateBollingerBands(prices, period = 20, stdDev = 2) {
        if (prices.length < period) return { upper: 0, middle: 0, lower: 0 };

        const middle = this.calculateSMA(prices, period);
        const recentPrices = prices.slice(-period);
        
        // محاسبه انحراف معیار
        const variance = recentPrices.reduce((sum, price) => {
            return sum + Math.pow(price - middle, 2);
        }, 0) / period;
        
        const standardDeviation = Math.sqrt(variance);
        
        return {
            upper: this.formatCalculationNumber(middle + (standardDeviation * stdDev)),
            middle: this.formatCalculationNumber(middle),
            lower: this.formatCalculationNumber(middle - (standardDeviation * stdDev)),
            bandwidth: this.formatCalculationNumber((standardDeviation * 2 * stdDev) / middle * 100)
        };
    }

    // تابع جدید برای محاسبه استوکاستیک
    calculateStochastic(highs, lows, closes, kPeriod = 14, dPeriod = 3) {
        if (closes.length < kPeriod) return { k: 50, d: 50 };

        const recentHighs = highs.slice(-kPeriod);
        const recentLows = lows.slice(-kPeriod);
        const currentClose = closes[closes.length - 1];
        
        const highestHigh = Math.max(...recentHighs);
        const lowestLow = Math.min(...recentLows);
        
        const k = ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100;
        
        // محاسبه %D که میانگین متحرک %K است
        const dValues = [];
        for (let i = 0; i < dPeriod; i++) {
            if (closes.length - i - kPeriod >= 0) {
                const periodHighs = highs.slice(-(kPeriod + i), -i);
                const periodLows = lows.slice(-(kPeriod + i), -i);
                const periodClose = closes[closes.length - 1 - i];
                
                const periodHighestHigh = Math.max(...periodHighs);
                const periodLowestLow = Math.min(...periodLows);
                
                dValues.push(((periodClose - periodLowestLow) / (periodHighestHigh - periodLowestLow)) * 100);
            }
        }
        
        const d = dValues.length > 0 ? dValues.reduce((sum, val) => sum + val, 0) / dValues.length : k;
        
        return {
            k: this.formatCalculationNumber(k),
            d: this.formatCalculationNumber(d)
        };
    }

    // تابع جدید برای محاسبه شاخص جهت‌گیری میانگین (ADX)
    calculateADX(highs, lows, closes, period = 14) {
        if (closes.length < period + 1) return 0;

        let plusDM = 0;
        let minusDM = 0;
        let sumTR = 0;

        // محاسبه برای دوره اخیر
        for (let i = closes.length - period; i < closes.length; i++) {
            const upMove = highs[i] - highs[i - 1];
            const downMove = lows[i - 1] - lows[i];
            
            if (upMove > downMove && upMove > 0) {
                plusDM += upMove;
            } else {
                plusDM += 0;
            }
            
            if (downMove > upMove && downMove > 0) {
                minusDM += downMove;
            } else {
                minusDM += 0;
            }
            
            const highLow = highs[i] - lows[i];
            const highClose = Math.abs(highs[i] - closes[i - 1]);
            const lowClose = Math.abs(lows[i] - closes[i - 1]);
            
            sumTR += Math.max(highLow, highClose, lowClose);
        }
        
        const plusDI = (plusDM / sumTR) * 100;
        const minusDI = (minusDM / sumTR) * 100;
        const dx = Math.abs(plusDI - minusDI) / (plusDI + minusDI) * 100;
        
        return this.formatCalculationNumber(dx);
    }

    // تابع جدید برای محاسبه میانگین واقعی دامنه (ATR)
    calculateATR(highs, lows, closes, period = 14) {
        if (closes.length < period + 1) return 0;

        let sumTR = 0;

        // محاسبه برای دوره اخیر
        for (let i = closes.length - period; i < closes.length; i++) {
            const highLow = highs[i] - lows[i];
            const highClose = Math.abs(highs[i] - closes[i - 1]);
            const lowClose = Math.abs(lows[i] - closes[i - 1]);
            
            sumTR += Math.max(highLow, highClose, lowClose);
        }
        
        return this.formatCalculationNumber(sumTR / period);
    }

    // تابع جدید برای محاسبه حجم تعادل (OBV)
    calculateOBV(closes, volumes) {
        if (closes.length < 2 || volumes.length < 2) return 0;

        let obv = 0;
        
        // محاسبه برای دوره اخیر
        for (let i = 1; i < closes.length; i++) {
            if (closes[i] > closes[i - 1]) {
                obv += volumes[i] || 0;
            } else if (closes[i] < closes[i - 1]) {
                obv -= volumes[i] || 0;
            }
            // اگر قیمت مساوی باشد، OBV تغییر نمی‌کند
        }
        
        return this.formatCalculationNumber(obv);
    }

    // تابع جدید برای محاسبه میانگین وزنی حجم (VWAP)
    calculateVWAP(prices, volumes) {
        if (prices.length === 0 || volumes.length === 0) return 0;

        let totalValue = 0;
        let totalVolume = 0;
        
        for (let i = 0; i < prices.length; i++) {
            totalValue += prices[i] * (volumes[i] || 0);
            totalVolume += volumes[i] || 0;
        }
        
        return totalVolume > 0 ? this.formatCalculationNumber(totalValue / totalVolume) : 0;
    }

    // تابع جدید برای محاسبه ابر ایچیموکو
    calculateIchimoku(highs, lows, closes, conversionPeriod = 9, basePeriod = 26, laggingSpanPeriod = 52, displacement = 26) {
        if (closes.length < laggingSpanPeriod) {
            return {
                conversionLine: 0,
                baseLine: 0,
                leadingSpanA: 0,
                leadingSpanB: 0,
                laggingSpan: 0
            };
        }

        // محاسبه خط تبدیل (Tenkan-sen)
        let conversionHighs = [];
        let conversionLows = [];
        
        for (let i = closes.length - conversionPeriod; i < closes.length; i++) {
            conversionHighs.push(highs[i]);
            conversionLows.push(lows[i]);
        }
        
        const conversionLine = (Math.max(...conversionHighs) + Math.min(...conversionLows)) / 2;
        
        // محاسبه خط پایه (Kijun-sen)
        let baseHighs = [];
        let baseLows = [];
        
        for (let i = closes.length - basePeriod; i < closes.length; i++) {
            baseHighs.push(highs[i]);
            baseLows.push(lows[i]);
        }
        
        const baseLine = (Math.max(...baseHighs) + Math.min(...baseLows)) / 2;
        
        // محاسبه پیشرو A (Senkou Span A)
        const leadingSpanA = (conversionLine + baseLine) / 2;
        
        // محاسبه پیشرو B (Senkou Span B)
        let laggingHighs = [];
        let laggingLows = [];
        
        for (let i = closes.length - laggingSpanPeriod; i < closes.length; i++) {
            laggingHighs.push(highs[i]);
            laggingLows.push(lows[i]);
        }
        
        const leadingSpanB = (Math.max(...laggingHighs) + Math.min(...laggingLows)) / 2;
        
        // محاسبه تأخیری (Chikou Span)
        const laggingSpan = closes.length > displacement ? closes[closes.length - displacement] : closes[0];
        
        return {
            conversionLine: this.formatCalculationNumber(conversionLine),
            baseLine: this.formatCalculationNumber(baseLine),
            leadingSpanA: this.formatCalculationNumber(leadingSpanA),
            leadingSpanB: this.formatCalculationNumber(leadingSpanB),
            laggingSpan: this.formatCalculationNumber(laggingSpan)
        };
    }

    // تابع جدید برای محاسبه سطوح بازگشت فیبوناچی
    calculateFibonacciRetracement(prices) {
        if (prices.length < 2) return { high: 0, low: 0, levels: [] };

        const recentPrices = prices.slice(-100); // استفاده از 100 قیمت اخیر
        const high = Math.max(...recentPrices);
        const low = Math.min(...recentPrices);
        const diff = high - low;
        
        // سطوح استاندارد فیبوناچی
        const fibonacciLevels = [
            { level: 0, price: high },
            { level: 0.236, price: high - (diff * 0.236) },
            { level: 0.382, price: high - (diff * 0.382) },
            { level: 0.5, price: high - (diff * 0.5) },
            { level: 0.618, price: high - (diff * 0.618) },
            { level: 0.786, price: high - (diff * 0.786) },
            { level: 1, price: low }
        ];
        
        return {
            high: this.formatCalculationNumber(high),
            low: this.formatCalculationNumber(low),
            levels: fibonacciLevels.map(item => ({
                level: item.level,
                price: this.formatCalculationNumber(item.price)
            }))
        };
    }

    // تابع جدید برای محاسبه پروفایل حجم
    calculateVolumeProfile(prices, volumes, bins = 20) {
        if (prices.length === 0 || volumes.length === 0) return { levels: [], poc: 0, vah: 0, val: 0 };

        const high = Math.max(...prices);
        const low = Math.min(...prices);
        const binSize = (high - low) / bins;
        
        // ایجاد سطوح قیمت
        const priceLevels = [];
        for (let i = 0; i < bins; i++) {
            const levelLow = low + (i * binSize);
            const levelHigh = low + ((i + 1) * binSize);
            const levelPrice = (levelLow + levelHigh) / 2;
            
            let totalVolume = 0;
            
            // محاسبه حجم در این سطح قیمت
            for (let j = 0; j < prices.length; j++) {
                if (prices[j] >= levelLow && prices[j] <= levelHigh) {
                    totalVolume += volumes[j] || 0;
                }
            }
            
            priceLevels.push({
                price: this.formatCalculationNumber(levelPrice),
                volume: totalVolume
            });
        }
        
        // مرتب‌سازی سطوح بر اساس حجم
        priceLevels.sort((a, b) => b.volume - a.volume);
        
        // پیدا کردن Point of Control (POC) - سطح با بیشترین حجم
        const poc = priceLevels.length > 0 ? priceLevels[0].price : 0;
        
        // محاسبه Value Area High (VAH) و Value Area Low (VAL)
        // 70% از کل حجم در Value Area قرار دارد
        const totalVolume = priceLevels.reduce((sum, level) => sum + level.volume, 0);
        const targetVolume = totalVolume * 0.7;
        
        let accumulatedVolume = 0;
        let vah = 0;
        let val = 0;
        
        // شروع از POC و اضافه کردن سطوح به ترتیب حجم
        for (const level of priceLevels) {
            accumulatedVolume += level.volume;
            
            if (vah === 0) {
                vah = level.price;
            }
            
            val = level.price;
            
            if (accumulatedVolume >= targetVolume) {
                break;
            }
        }
        
        return {
            levels: priceLevels,
            poc: poc,
            vah: vah,
            val: val
        };
    }

    calculateRSI(prices, period = 14) {
        if (prices.length < period + 1) return 50;

        const changes = [];
        for (let i = 1; i < prices.length; i++) {
            changes.push(prices[i] - prices[i - 1]);
        }

        const gains = changes.map(change => change > 0 ? change : 0);
        const losses = changes.map(change => change < 0 ? Math.abs(change) : 0);

        let avgGain = gains.slice(0, period).reduce((sum, gain) => sum + gain, 0) / period;
        let avgLoss = losses.slice(0, period).reduce((sum, loss) => sum + loss, 0) / period;

        for (let i = period; i < gains.length; i++) {
            avgGain = (avgGain * (period - 1) + gains[i]) / period;
            avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
        }

        const rs = avgGain / avgLoss;
        const rsi = 100 - (100 / (1 + rs));

        return Math.round(rsi * 100) / 100;
    }

    calculateMACD(prices, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
        const fastEMA = this.calculateEMA(prices, fastPeriod);
        const slowEMA = this.calculateEMA(prices, slowPeriod);
        const macdLine = fastEMA - slowEMA;
        
        return this.formatCalculationNumber(macdLine);
    }

    calculateSMA(prices, period) {
        if (prices.length < period) return prices[prices.length - 1] || 0;

        const sum = prices.slice(-period).reduce((sum, price) => sum + price, 0);
        return this.formatCalculationNumber(sum / period);
    }

    calculateEMA(prices, period) {
        if (prices.length < period) return prices[prices.length - 1] || 0;

        const multiplier = 2 / (period + 1);
        let ema = prices.slice(0, period).reduce((sum, price) => sum + price, 0) / period;

        for (let i = period; i < prices.length; i++) {
            ema = (prices[i] - ema) * multiplier + ema;
        }

        return this.formatCalculationNumber(ema);
    }

    // جایگزین توابع calculateSupportLevels و calculateResistanceLevels
    calculateSupportLevels(prices, timeframe = 'short') {
        const currentPrice = prices[prices.length - 1];
        const supportLevels = [];
        
        // تعیین دوره زمانی بر اساس نوع تحلیل
        const period = timeframe === 'short' ? 14 : 50;
        const dataPoints = timeframe === 'short' ? prices.slice(-period) : prices;
        
        // الگوریتم بهبودیافته برای پیدا کردن سطوح حمایت
        for (let i = 2; i < dataPoints.length - 2; i++) {
            // پیدا کردن کف‌های محلی
            if (dataPoints[i] < dataPoints[i - 1] && dataPoints[i] < dataPoints[i + 1] && 
                dataPoints[i] < dataPoints[i - 2] && dataPoints[i] < dataPoints[i + 2]) {
                
                // فقط سطوحی که پایین‌تر از قیمت فعلی هستند
                if (dataPoints[i] < currentPrice) {
                    // بررسی حجم معاملات در این سطح
                    const volumeAtLevel = this.getVolumeAtPriceLevel(dataPoints[i]);
                    supportLevels.push({
                        price: dataPoints[i],
                        strength: this.calculateLevelStrength(dataPoints, i, 'support'),
                        volume: volumeAtLevel,
                        timeframe: timeframe
                    });
                }
            }
        }

        // شناسایی Order Blocks
        const orderBlocks = this.identifyOrderBlocks(dataPoints, 'support');
        orderBlocks.forEach(block => {
            if (block.price < currentPrice) {
                supportLevels.push({
                    price: block.price,
                    strength: block.strength,
                    volume: block.volume,
                    timeframe: timeframe,
                    type: 'orderblock'
                });
            }
        });

        // مرتب‌سازی و حذف سطوح نزدیک به هم
        supportLevels.sort((a, b) => b.price - a.price);
        const filteredLevels = this.filterAndMergeLevels(supportLevels);

        // اگر به اندازه کافی سطح پیدا نشد، از سطوح فیبوناچی استفاده کن
        while (filteredLevels.length < 3) {
            const lastLevel = filteredLevels.length > 0 ? filteredLevels[filteredLevels.length - 1].price : currentPrice;
            filteredLevels.push({
                price: this.formatCalculationNumber(lastLevel * 0.95),
                strength: 0.5,
                volume: 0,
                timeframe: timeframe,
                type: 'fibonacci'
            });
        }

        return filteredLevels.slice(0, 3);
    }

    calculateResistanceLevels(prices, timeframe = 'short') {
        const currentPrice = prices[prices.length - 1];
        const resistanceLevels = [];
        
        // تعیین دوره زمانی بر اساس نوع تحلیل
        const period = timeframe === 'short' ? 14 : 50;
        const dataPoints = timeframe === 'short' ? prices.slice(-period) : prices;
        
        // الگوریتم بهبودیافته برای پیدا کردن سطوح مقاومت
        for (let i = 2; i < dataPoints.length - 2; i++) {
            // پیدا کردن سقف‌های محلی
            if (dataPoints[i] > dataPoints[i - 1] && dataPoints[i] > dataPoints[i + 1] && 
                dataPoints[i] > dataPoints[i - 2] && dataPoints[i] > dataPoints[i + 2]) {
                
                // فقط سطوحی که بالاتر از قیمت فعلی هستند
                if (dataPoints[i] > currentPrice) {
                    // بررسی حجم معاملات در این سطح
                    const volumeAtLevel = this.getVolumeAtPriceLevel(dataPoints[i]);
                    resistanceLevels.push({
                        price: dataPoints[i],
                        strength: this.calculateLevelStrength(dataPoints, i, 'resistance'),
                        volume: volumeAtLevel,
                        timeframe: timeframe
                    });
                }
            }
        }

        // شناسایی Order Blocks
        const orderBlocks = this.identifyOrderBlocks(dataPoints, 'resistance');
        orderBlocks.forEach(block => {
            if (block.price > currentPrice) {
                resistanceLevels.push({
                    price: block.price,
                    strength: block.strength,
                    volume: block.volume,
                    timeframe: timeframe,
                    type: 'orderblock'
                });
            }
        });

        // مرتب‌سازی و حذف سطوح نزدیک به هم
        resistanceLevels.sort((a, b) => a.price - b.price);
        const filteredLevels = this.filterAndMergeLevels(resistanceLevels);

        // اگر به اندازه کافی سطح پیدا نشد، از سطوح فیبوناچی استفاده کن
        while (filteredLevels.length < 3) {
            const lastLevel = filteredLevels.length > 0 ? filteredLevels[filteredLevels.length - 1].price : currentPrice;
            filteredLevels.push({
                price: this.formatCalculationNumber(lastLevel * 1.05),
                strength: 0.5,
                volume: 0,
                timeframe: timeframe,
                type: 'fibonacci'
            });
        }

        return filteredLevels.slice(0, 3);
    }

    identifyOrderBlocks(data, type) {
        const orderBlocks = [];
        
        if (!this.cryptoData.historicalData || this.cryptoData.historicalData.length < 5) {
            return orderBlocks;
        }
        
        const ohlcData = this.cryptoData.historicalData;
        
        // شناسایی شمع‌های صعودی و نزولی قوی
        for (let i = 1; i < ohlcData.length; i++) {
            const currentCandle = ohlcData[i];
            const previousCandle = ohlcData[i - 1];
            
            // محاسبه اندازه بدنه و سایه‌ها
            const bodySize = Math.abs(currentCandle.close - currentCandle.open);
            const upperWick = currentCandle.high - Math.max(currentCandle.open, currentCandle.close);
            const lowerWick = Math.min(currentCandle.open, currentCandle.close) - currentCandle.low;
            const totalWick = upperWick + lowerWick;
            
            // شمع صعودی قوی (بدنه بزرگ و سایه کوچک)
            if (currentCandle.close > currentCandle.open && bodySize > totalWick * 1.5) {
                const bullishCandle = {
                    index: i,
                    low: currentCandle.low,
                    high: currentCandle.high,
                    open: currentCandle.open,
                    close: currentCandle.close,
                    volume: currentCandle.volume || 0,
                    type: 'bullish'
                };
                
                // بررسی اینکه آیا این شمع بخشی از یک حرکت قوی است
                if (i > 0 && previousCandle.close > previousCandle.open) {
                    // دو شمع صعودی پشت سر هم - سیگنال قوی‌تر
                    bullishCandle.strength = 0.8;
                } else {
                    bullishCandle.strength = 0.6;
                }
                
                orderBlocks.push(bullishCandle);
            }
            
            // شمع نزولی قوی
            if (currentCandle.close < currentCandle.open && bodySize > totalWick * 1.5) {
                const bearishCandle = {
                    index: i,
                    low: currentCandle.low,
                    high: currentCandle.high,
                    open: currentCandle.open,
                    close: currentCandle.close,
                    volume: currentCandle.volume || 0,
                    type: 'bearish'
                };
                
                // بررسی اینکه آیا این شمع بخشی از یک حرکت قوی است
                if (i > 0 && previousCandle.close < previousCandle.open) {
                    // دو شمع نزولی پشت سر هم - سیگنال قوی‌تر
                    bearishCandle.strength = 0.8;
                } else {
                    bearishCandle.strength = 0.6;
                }
                
                orderBlocks.push(bearishCandle);
            }
        }
        
        // فیلتر کردن Order Blocks بر اساس نوع (حمایت یا مقاومت)
        let filteredBlocks = [];
        
        if (type === 'support') {
            // Order Block‌های حمایت: پایین آخرین شمع صعودی قوی
            const bullishBlocks = orderBlocks.filter(block => block.type === 'bullish');
            
            if (bullishBlocks.length > 0) {
                // مرتب‌سازی بر اساس شاخص (جدیدترین‌ها اول)
                bullishBlocks.sort((a, b) => b.index - a.index);
                
                // گرفتن چند مورد آخر
                const recentBullishBlocks = bullishBlocks.slice(0, 3);
                
                filteredBlocks = recentBullishBlocks.map(block => ({
                    price: block.low,
                    strength: block.strength,
                    volume: block.volume,
                    index: block.index,
                    type: 'orderblock'
                }));
            }
        } else if (type === 'resistance') {
            // Order Block‌های مقاومت: بالاترین آخرین شمع نزولی قوی
            const bearishBlocks = orderBlocks.filter(block => block.type === 'bearish');
            
            if (bearishBlocks.length > 0) {
                // مرتب‌سازی بر اساس شاخص (جدیدترین‌ها اول)
                bearishBlocks.sort((a, b) => b.index - a.index);
                
                // گرفتن چند مورد آخر
                const recentBearishBlocks = bearishBlocks.slice(0, 3);
                
                filteredBlocks = recentBearishBlocks.map(block => ({
                    price: block.high,
                    strength: block.strength,
                    volume: block.volume,
                    index: block.index,
                    type: 'orderblock'
                }));
            }
        }
        
        return filteredBlocks;
    }

    getVolumeAtPriceLevel(priceLevel) {
        if (!this.cryptoData.historicalData || this.cryptoData.historicalData.length === 0) {
            return 0;
        }
        
        let totalVolume = 0;
        const tolerance = priceLevel * 0.02; // 2% tolerance
        
        this.cryptoData.historicalData.forEach(data => {
            // بررسی اینکه آیا سطح قیمت در محدوده High/Low شمع قرار دارد
            if (data.low <= priceLevel + tolerance && data.high >= priceLevel - tolerance) {
                totalVolume += data.volume || 0;
            }
        });
        
        return totalVolume;
    }

    calculateLevelStrength(data, index, type) {
        let strength = 0;
        const price = data[index];
        const tolerance = price * 0.01; // 1% tolerance
        
        // تعداد دفعاتی که قیمت این سطح را لمس کرده و برگشته است
        let touches = 0;
        let bounces = 0;
        
        for (let i = 0; i < data.length; i++) {
            if (Math.abs(data[i] - price) < tolerance) {
                touches++;
                
                // بررسی اینکه آیا پس از لمس، قیمت برگشته است
                if (i > 0 && i < data.length - 1) {
                    // برای حمایت: قیمت به سطح رسیده و سپس بالا رفته
                    if (type === 'support' && data[i-1] > price && data[i+1] > price) {
                        bounces++;
                    } 
                    // برای مقاومت: قیمت به سطح رسیده و سپس پایین رفته
                    else if (type === 'resistance' && data[i-1] < price && data[i+1] < price) {
                        bounces++;
                    }
                }
            }
        }
        
        // محاسبه قدرت بر اساس تعداد لمس‌ها و برگشت‌ها
        if (touches > 0) {
            strength = (bounces / touches) * 0.7 + (touches / data.length) * 0.3;
        }
        
        // بررسی حجم معاملات در این سطح
        const volumeAtLevel = this.getVolumeAtPriceLevel(price);
        const avgVolume = this.cryptoData.historicalData.reduce((sum, d) => sum + (d.volume || 0), 0) / this.cryptoData.historicalData.length;
        
        if (avgVolume > 0) {
            const volumeFactor = Math.min(volumeAtLevel / avgVolume, 2) / 2; // حداکثر 2 برابر میانگین
            strength = strength * 0.8 + volumeFactor * 0.2; // 20% از قدرت بر اساس حجم
        }
        
        return Math.min(strength, 1); // حداکثر قدرت 1
    }

    // تابع کمکی برای ادغام سطوح نزدیک به هم
    filterAndMergeLevels(levels) {
        const filteredLevels = [];
        
        for (const level of levels) {
            let isClose = false;
            
            for (const existingLevel of filteredLevels) {
                if (Math.abs(level.price - existingLevel.price) / existingLevel.price < 0.02) { // کمتر از 2% فاصله
                    isClose = true;
                    
                    // ادغام سطوح با حفظ قوی‌ترین سطح
                    if (level.strength > existingLevel.strength) {
                        const index = filteredLevels.indexOf(existingLevel);
                        filteredLevels[index] = level;
                    }
                    break;
                }
            }
            
            if (!isClose) {
                filteredLevels.push(level);
            }
        }
        
        return filteredLevels;
    }

    async fetchFearGreedIndex() {
        try {
            // دریافت شاخص ترس و طمع از Alternative.me API
            const response = await fetch('https://api.alternative.me/fng/');
            
            if (!response.ok) {
                throw new Error('خطا در دریافت شاخص ترس و طمع');
            }

            const data = await response.json();
            this.cryptoData.fearGreedIndex = parseInt(data.data[0].value);
            
            console.log('Fear & Greed Index:', this.cryptoData.fearGreedIndex);

        } catch (error) {
            console.error('Error fetching Fear & Greed Index:', error);
            // در صورت خطا، مقدار پیش‌فرض
            this.cryptoData.fearGreedIndex = 50;
        }
    }

    async performAIAnalysis() {
        const prompt = this.generatePrompt();
        console.log('Generated prompt:', prompt);
        
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: this.selectedModel,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 3000,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(this.currentLanguage === 'fa' ? 'خطا در ارتباط با API' : 'API connection error');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    // تابع جدید برای دریافت داده‌های تاریخی از CoinPaprika
    async fetchHistoricalData() {
        try {
            // استفاده از تابع جدید برای دریافت داده‌های تاریخی از CoinGecko
            return await this.fetchHistoricalDataFromCoinGecko();
        } catch (error) {
            console.error('Error fetching historical data:', error);
            // در صورت خطا، داده‌های شبیه‌سازی شده برمی‌گردانیم
            return this.generateSimulatedHistoricalData();
        }
    }

    // تابع جدید برای دریافت داده‌های صرافی‌ها
    async fetchExchangeData() {
        try {
            const response = await fetch(`https://api.coinpaprika.com/v1/coins/${this.cryptoInfo.coinpaprikaId}/exchanges`);
            
            if (!response.ok) {
                throw new Error('خطا در دریافت داده‌های صرافی‌ها');
            }

            const data = await response.json();
            
            // استخراج داده‌های حجم معاملات از صرافی‌های برتر
            return data.slice(0, 10).map(exchange => ({
                name: exchange.name,
                pair: exchange.pair,
                volume: exchange.quotes.USD.volume_24h,
                price: exchange.quotes.USD.price
            }));

        } catch (error) {
            console.error('Error fetching exchange data:', error);
            return [];
        }
    }

    // تابع جدید برای محاسبه قدرت Order Block
    calculateOrderBlockStrength(orderBlock, data) {
        let strength = 0;
        const price = orderBlock.price;
        const volume = orderBlock.volume;
        const index = orderBlock.index;
        
        // فاکتور 1: حجم معاملات در Order Block (40% از قدرت)
        const avgVolume = data.reduce((sum, d, i) => {
            if (i < data.length - 1 && this.cryptoData.historicalData[i]) {
                return sum + (this.cryptoData.historicalData[i].volume || 0);
            }
            return sum;
        }, 0) / (data.length - 1);
        
        const volumeFactor = Math.min(volume / avgVolume, 3) / 3; // حداکثر 3 برابر میانگین
        strength += volumeFactor * 0.4;
        
        // فاکتور 2: واکنش قیمت پس از Order Block (30% از قدرت)
        let reactionScore = 0;
        const lookAheadPeriod = Math.min(10, data.length - index - 1);
        
        if (lookAheadPeriod > 0) {
            for (let i = 1; i <= lookAheadPeriod; i++) {
                const currentIndex = index + i;
                if (currentIndex >= data.length) break;
                
                // برای Order Block حمایت، بررسی می‌کنیم که قیمت چقدر بالا رفته
                if (orderBlock.type === 'support') {
                    const priceIncrease = (data[currentIndex] - price) / price;
                    reactionScore += Math.min(priceIncrease, 0.1) * 10; // حداکثر 1 نمره برای هر دوره
                }
                // برای Order Block مقاومت، بررسی می‌کنیم که قیمت چقدر پایین رفته
                else if (orderBlock.type === 'resistance') {
                    const priceDecrease = (price - data[currentIndex]) / price;
                    reactionScore += Math.min(priceDecrease, 0.1) * 10; // حداکثر 1 نمره برای هر دوره
                }
            }
            
            const reactionFactor = Math.min(reactionScore / lookAheadPeriod, 1);
            strength += reactionFactor * 0.3;
        }
        
        // فاکتور 3: تعداد لمس‌های بعدی (20% از قدرت)
        let touches = 0;
        const tolerance = price * 0.02; // 2% tolerance
        
        for (let i = index + 1; i < data.length; i++) {
            if (Math.abs(data[i] - price) < tolerance) {
                touches++;
            }
        }
        
        const touchesFactor = Math.min(touches / 5, 1); // حداکثر 5 لمس
        strength += touchesFactor * 0.2;
        
        // فاکتور 4: فاصله زمانی از Order Block (10% از قدرت)
        const timeFactor = 1 - (index / data.length); // Order Block‌های جدیدتر قدرت بیشتری دارند
        strength += timeFactor * 0.1;
        
        return Math.min(strength, 1); // حداکثر قدرت 1
    }

    // تابع جدید برای نمایش پروفایل حجم
    displayVolumeProfile() {
        const volumeProfileContent = document.getElementById('volumeProfileContent');
        
        if (!this.cryptoData.technicalIndicators || !this.cryptoData.technicalIndicators.volumeProfile) {
            volumeProfileContent.innerHTML = `
                <div class="no-data">
                    <p>${this.currentLanguage === 'fa' ? 'داده‌ای برای نمایش پروفایل حجم موجود نیست' : 'No volume profile data available'}</p>
                </div>
            `;
            return;
        }
        
        const volumeProfile = this.cryptoData.technicalIndicators.volumeProfile;
        const poc = this.formatPrice(volumeProfile.poc, this.cryptoInfo.symbol);
        const vah = this.formatPrice(volumeProfile.vah, this.cryptoInfo.symbol);
        const val = this.formatPrice(volumeProfile.val, this.cryptoInfo.symbol);
        
        // نمایش سطوح کلیدی پروفایل حجم
        volumeProfileContent.innerHTML = `
            <div class="volume-profile-summary">
                <div class="volume-level-item">
                    <div class="level-label">${this.currentLanguage === 'fa' ? 'Point of Control (POC)' : 'Point of Control (POC)'}</div>
                    <div class="level-value">$${poc}</div>
                    <div class="level-description">${this.currentLanguage === 'fa' ? 'بیشترین حجم معاملات' : 'Highest trading volume'}</div>
                </div>
                <div class="volume-level-item">
                    <div class="level-label">${this.currentLanguage === 'fa' ? 'Value Area High (VAH)' : 'Value Area High (VAH)'}</div>
                    <div class="level-value">$${vah}</div>
                    <div class="level-description">${this.currentLanguage === 'fa' ? 'بالاترین سطح ارزش' : 'Highest value level'}</div>
                </div>
                <div class="volume-level-item">
                    <div class="level-label">${this.currentLanguage === 'fa' ? 'Value Area Low (VAL)' : 'Value Area Low (VAL)'}</div>
                    <div class="level-value">$${val}</div>
                    <div class="level-description">${this.currentLanguage === 'fa' ? 'پایین‌ترین سطح ارزش' : 'Lowest value level'}</div>
                </div>
            </div>
            
            <div class="volume-profile-chart">
                <h4>${this.currentLanguage === 'fa' ? 'توزیع حجم بر اساس قیمت' : 'Volume Distribution by Price'}</h4>
                <div class="volume-bars" id="volumeBars"></div>
            </div>
            
            <div class="volume-profile-analysis">
                <h4>${this.currentLanguage === 'fa' ? 'تحلیل پروفایل حجم' : 'Volume Profile Analysis'}</h4>
                <p>${this.getVolumeProfileAnalysis(volumeProfile)}</p>
            </div>
        `;
        
        // رسم نمودار میله‌ای پروفایل حجم
        this.drawVolumeProfileChart(volumeProfile);
    }

    // تابع کمکی برای رسم نمودار پروفایل حجم
    drawVolumeProfileChart(volumeProfile) {
        const volumeBars = document.getElementById('volumeBars');
        if (!volumeBars || !volumeProfile.levels || volumeProfile.levels.length === 0) {
            return;
        }
        
        // مرتب‌سازی سطوح بر اساس قیمت
        const sortedLevels = [...volumeProfile.levels].sort((a, b) => a.price - b.price);
        
        // پیدا کردن حداکثر حجم برای نرمال‌سازی
        const maxVolume = Math.max(...sortedLevels.map(level => level.volume));
        
        // ایجاد میله‌های حجم
        volumeBars.innerHTML = sortedLevels.map(level => {
            const percentage = (level.volume / maxVolume) * 100;
            const isPOC = Math.abs(level.price - volumeProfile.poc) < (volumeProfile.poc * 0.01);
            const isVAH = Math.abs(level.price - volumeProfile.vah) < (volumeProfile.vah * 0.01);
            const isVAL = Math.abs(level.price - volumeProfile.val) < (volumeProfile.val * 0.01);
            
            let barClass = 'volume-bar';
            if (isPOC) barClass += ' poc-bar';
            else if (isVAH || isVAL) barClass += ' va-bar';
            
            return `
                <div class="volume-bar-container">
                    <div class="${barClass}" style="width: ${percentage}%"></div>
                    <div class="volume-bar-label">$${this.formatPrice(level.price, this.cryptoInfo.symbol)}</div>
                    <div class="volume-bar-value">${this.formatNumber(level.volume)}</div>
                </div>
            `;
        }).join('');
    }

    // تابع کمکی برای تحلیل پروفایل حجم
    getVolumeProfileAnalysis(volumeProfile) {
        const currentPrice = this.cryptoData.price;
        const poc = volumeProfile.poc;
        const vah = volumeProfile.vah;
        const val = volumeProfile.val;
        
        let analysis = '';
        
        if (this.currentLanguage === 'fa') {
            if (currentPrice > vah) {
                analysis = `قیمت فعلی ($${this.formatPrice(currentPrice, this.cryptoInfo.symbol)}) بالاتر از Value Area High ($${vah}) قرار دارد. این نشان می‌دهد که خریداران قوی هستند و ممکن است قیمت به سطوح بالاتر حرکت کند. با این حال، این منطقه ممکن است با مقاومت مواجه شود.`;
            } else if (currentPrice < val) {
                analysis = `قیمت فعلی ($${this.formatPrice(currentPrice, this.cryptoInfo.symbol)}) پایین‌تر از Value Area Low ($${val}) قرار دارد. این نشان می‌دهد که فروشندگان کنترل دارند و ممکن است قیمت به سطوح پایین‌تر ادامه دهد. این منطقه ممکن است به عنوان حمایت عمل کند.`;
            } else {
                analysis = `قیمت فعلی ($${this.formatPrice(currentPrice, this.cryptoInfo.symbol)}) در داخل Value Area (بین $${val} و $${vah}) قرار دارد. این نشان‌دهنده‌ی تعادل بین خریداران و فروشندگان است. Point of Control در $${poc} مهم‌ترین سطح قیمت در این محدوده است.`;
            }
            
            // افزودن تحلیل مربوط به شکل پروفایل
            const profileShape = this.analyzeProfileShape(volumeProfile);
            analysis += ` ${profileShape}`;
            
        } else {
            if (currentPrice > vah) {
                analysis = `Current price ($${this.formatPrice(currentPrice, this.cryptoInfo.symbol)}) is above Value Area High ($${vah}). This indicates strong buying pressure and the price may move to higher levels. However, this area may face resistance.`;
            } else if (currentPrice < val) {
                analysis = `Current price ($${this.formatPrice(currentPrice, this.cryptoInfo.symbol)}) is below Value Area Low ($${val}). This indicates sellers are in control and the price may continue to lower levels. This area may act as support.`;
            } else {
                analysis = `Current price ($${this.formatPrice(currentPrice, this.cryptoInfo.symbol)}) is inside the Value Area (between $${val} and $${vah}). This indicates a balance between buyers and sellers. The Point of Control at $${poc} is the most important price level in this range.`;
            }
            
            // افزودن تحلیل مربوط به شکل پروفایل
            const profileShape = this.analyzeProfileShape(volumeProfile);
            analysis += ` ${profileShape}`;
        }
        
        return analysis;
    }

    // تابع کمکی برای تحلیل شکل پروفایل حجم
    analyzeProfileShape(volumeProfile) {
        if (!volumeProfile.levels || volumeProfile.levels.length === 0) {
            return this.currentLanguage === 'fa' ? 
                'اطلاعات کافی برای تحلیل شکل پروفایل وجود ندارد.' : 
                'Insufficient information to analyze profile shape.';
        }
        
        // تحلیل توزیع حجم
        const sortedLevels = [...volumeProfile.levels].sort((a, b) => b.volume - a.volume);
        const topLevels = sortedLevels.slice(0, 3);
        const totalVolume = sortedLevels.reduce((sum, level) => sum + level.volume, 0);
        const topVolume = topLevels.reduce((sum, level) => sum + level.volume, 0);
        const concentration = (topVolume / totalVolume) * 100;
        
        if (this.currentLanguage === 'fa') {
            if (concentration > 50) {
                return `پروفایل حجم دارای تمرکز بالا (${concentration.toFixed(1)}%) است که نشان‌دهنده‌ی وجود یک منطقه قیمت مهم و احتمالاً ادامه روند است.`;
            } else if (concentration > 30) {
                return `پروفایل حجم دارای تمرکز متوسط (${concentration.toFixed(1)}%) است که نشان‌دهنده‌ی یک بازار متعادل با مناطق قیمت متعدد است.`;
            } else {
                return `پروفایل حجم دارای توزیع گسترده (${concentration.toFixed(1)}%) است که نشان‌دهنده‌ی عدم قطعیت در بازار و احتمال تغییر روند است.`;
            }
        } else {
            if (concentration > 50) {
                return `The volume profile has high concentration (${concentration.toFixed(1)}%), indicating the presence of an important price area and potential trend continuation.`;
            } else if (concentration > 30) {
                return `The volume profile has medium concentration (${concentration.toFixed(1)}%), indicating a balanced market with multiple price areas.`;
            } else {
                return `The volume profile has wide distribution (${concentration.toFixed(1)}%), indicating market uncertainty and potential trend change.`;
            }
        }
    }

    // تابع کمکی برای فرمت‌بندی اعداد بزرگ
    formatNumber(num) {
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(2) + 'B';
        } else if (num >= 1000000) {
            return (num / 1000000).toFixed(2) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(2) + 'K';
        } else {
            return num.toFixed(2);
        }
    }

    // تابع جدید برای نمایش سطوح فیبوناچی
    displayFibonacciLevels() {
        const fibonacciContent = document.getElementById('fibonacciContent');
        
        if (!this.cryptoData.technicalIndicators || !this.cryptoData.technicalIndicators.fibonacci) {
            fibonacciContent.innerHTML = `
                <div class="no-data">
                    <p>${this.currentLanguage === 'fa' ? 'داده‌ای برای نمایش سطوح فیبوناچی موجود نیست' : 'No Fibonacci data available'}</p>
                </div>
            `;
            return;
        }
        
        const fibonacci = this.cryptoData.technicalIndicators.fibonacci;
        const currentPrice = this.cryptoData.price;
        
        fibonacciContent.innerHTML = `
            <div class="fibonacci-summary">
                <div class="fibonacci-range">
                    <div class="fib-range-item">
                        <span class="fib-label">${this.currentLanguage === 'fa' ? 'بالاترین قیمت' : 'High Price'}</span>
                        <span class="fib-value">$${this.formatPrice(fibonacci.high, this.cryptoInfo.symbol)}</span>
                    </div>
                    <div class="fib-range-item">
                        <span class="fib-label">${this.currentLanguage === 'fa' ? 'پایین‌ترین قیمت' : 'Low Price'}</span>
                        <span class="fib-value">$${this.formatPrice(fibonacci.low, this.cryptoInfo.symbol)}</span>
                    </div>
                </div>
            </div>
            
            <div class="fibonacci-levels">
                <h4>${this.currentLanguage === 'fa' ? 'سطوح بازگشت فیبوناچی' : 'Fibonacci Retracement Levels'}</h4>
                ${fibonacci.levels.map(level => {
                    const isNearCurrentPrice = Math.abs(level.price - currentPrice) / currentPrice < 0.02;
                    const levelClass = isNearCurrentPrice ? 'fib-level current-price' : 'fib-level';
                    
                    return `
                        <div class="${levelClass}">
                            <span class="fib-percent">${(level.level * 100).toFixed(1)}%</span>
                            <span class="fib-price">$${this.formatPrice(level.price, this.cryptoInfo.symbol)}</span>
                            ${isNearCurrentPrice ? `<span class="current-indicator">${this.currentLanguage === 'fa' ? 'قیمت فعلی' : 'Current Price'}</span>` : ''}
                        </div>
                    `;
                }).join('')}
            </div>
            
            <div class="fibonacci-analysis">
                <h4>${this.currentLanguage === 'fa' ? 'تحلیل سطوح فیبوناچی' : 'Fibonacci Analysis'}</h4>
                <p>${this.getFibonacciAnalysis(fibonacci, currentPrice)}</p>
            </div>
        `;
    }

    // تابع کمکی برای تحلیل سطوح فیبوناچی
    getFibonacciAnalysis(fibonacci, currentPrice) {
        const range = fibonacci.high - fibonacci.low;
        const currentPosition = (currentPrice - fibonacci.low) / range;
        
        let analysis = '';
        
        if (this.currentLanguage === 'fa') {
            if (currentPosition > 0.786) {
                analysis = `قیمت فعلی در بالاترین سطح فیبوناچی (78.6%) قرار دارد که نشان‌دهنده‌ی قدرت خریداران است. با این حال، این منطقه ممکن است با مقاومت مواجه شود.`;
            } else if (currentPosition > 0.618) {
                analysis = `قیمت فعلی در سطح طلایی فیبوناچی (61.8%) قرار دارد که یکی از مهم‌ترین سطوح حمایت/مقاومت است. واکنش قیمت در این منطقه بسیار مهم است.`;
            } else if (currentPosition > 0.5) {
                analysis = `قیمت فعلی در سطح 50% فیبوناچی قرار دارد که یک سطح روانی مهم است و اغلب به عنوان حمایت یا مقاومت عمل می‌کند.`;
            } else if (currentPosition > 0.382) {
                analysis = `قیمت فعلی در سطح 38.2% فیبوناچی قرار دارد که یک سطح اصلاحی مهم است. اگر این سطح حمایت شود، ممکن است شاهد ادامه روند صعودی باشیم.`;
            } else if (currentPosition > 0.236) {
                analysis = `قیمت فعلی در سطح 23.6% فیبوناچی قرار دارد که یک سطح اصلاحی ضعیف است. اگر قیمت از این سطح پایین‌تر برود، ممکن است اصلاح عمیق‌تری داشته باشیم.`;
            } else {
                analysis = `قیمت فعلی زیر تمام سطوح کلیدی فیبوناچی قرار دارد که نشان‌دهنده‌ی ضعف نسبی است. سطح 23.6% ($${this.formatPrice(fibonacci.low + (range * 0.236), this.cryptoInfo.symbol)}) اولین مقاومت مهم است.`;
            }
        } else {
            if (currentPosition > 0.786) {
                analysis = `Current price is at the highest Fibonacci level (78.6%), indicating strong buying pressure. However, this area may face resistance.`;
            } else if (currentPosition > 0.618) {
                analysis = `Current price is at the golden Fibonacci level (61.8%), which is one of the most important support/resistance levels. Price reaction at this level is very important.`;
            } else if (currentPosition > 0.5) {
                analysis = `Current price is at the 50% Fibonacci level, which is an important psychological level and often acts as support or resistance.`;
            } else if (currentPosition > 0.382) {
                analysis = `Current price is at the 38.2% Fibonacci level, which is an important correction level. If this level holds as support, we may see trend continuation.`;
            } else if (currentPosition > 0.236) {
                analysis = `Current price is at the 23.6% Fibonacci level, which is a weak correction level. If price breaks below this level, we may see a deeper correction.`;
            } else {
                analysis = `Current price is below all key Fibonacci levels, indicating relative weakness. The 23.6% level ($${this.formatPrice(fibonacci.low + (range * 0.236), this.cryptoInfo.symbol)}) is the first important resistance.`;
            }
        }
        
        return analysis;
    }

    generatePrompt() {
        const cryptoData = this.cryptoData;
        const cryptoInfo = this.cryptoInfo;
        
        // استفاده از تابع جدید برای فرمت‌بندی قیمت
        const formattedPrice = this.formatPrice(cryptoData.price, cryptoInfo.symbol);
        const formattedSMA20 = this.formatPrice(cryptoData.technicalIndicators.sma20, cryptoInfo.symbol);
        const formattedSMA50 = this.formatPrice(cryptoData.technicalIndicators.sma50, cryptoInfo.symbol);
        
        // سطوح حمایت و مقاومت بر اساس نوع تحلیل
        const supportLevels = this.analysisType === 'short' ? 
            cryptoData.supportLevelsShort : cryptoData.supportLevelsLong;
        const resistanceLevels = this.analysisType === 'short' ? 
            cryptoData.resistanceLevelsShort : cryptoData.resistanceLevelsLong;
        
        const formattedSupportLevels = supportLevels.map(level => 
            `${this.formatPrice(level.price, cryptoInfo.symbol)} (قدرت: ${(level.strength * 100).toFixed(0)}%)`
        ).join(', ');
        const formattedResistanceLevels = resistanceLevels.map(level => 
            `${this.formatPrice(level.price, cryptoInfo.symbol)} (قدرت: ${(level.strength * 100).toFixed(0)}%)`
        ).join(', ');
        
        if (this.currentLanguage === 'fa') {
            if (this.analysisType === 'short') {
                return `لطفاً یک تحلیل کوتاه مدت جامع برای ارز دیجیتال ${cryptoInfo.name} (${cryptoInfo.symbol}) ارائه دهید.

    تحلیل کوتاه مدت باید روی موارد زیر تمرکز کند:
    - تحلیل تکنیکال و شاخص‌های فوری
    - رفتار قیمت و حجم معاملات
    - شاخص ترس و طمع فعلی
    - سیگنال‌های معاملاتی کوتاه مدت
    - Order Blocks و سطوح کلیدی کوتاه مدت

    داده‌های لحظه‌ای و واقعی:
    - قیمت فعلی: $${formattedPrice}
    - تغییر قیمت 24 ساعته: ${cryptoData.priceChange24h.toFixed(2)}%
    - حجم معاملات 24 ساعته: $${(cryptoData.volume24h / 1000000000).toFixed(1)}B
    - ارزش بازار: $${(cryptoData.marketCap / 1000000000).toFixed(1)}B
    - RSI (محاسبه شده): ${cryptoData.technicalIndicators.rsi}
    - MACD (محاسبه شده): ${cryptoData.technicalIndicators.macd}
    - SMA20 (محاسبه شده): $${formattedSMA20}
    - SMA50 (محاسبه شده): $${formattedSMA50}
    - باندهای بولینگر: بالا=${this.formatPrice(cryptoData.technicalIndicators.bollingerBands.upper, cryptoInfo.symbol)}, میانی=${this.formatPrice(cryptoData.technicalIndicators.bollingerBands.middle, cryptoInfo.symbol)}, پایین=${this.formatPrice(cryptoData.technicalIndicators.bollingerBands.lower, cryptoInfo.symbol)}
    - استوکاستیک: K=${cryptoData.technicalIndicators.stochastic.k}, D=${cryptoData.technicalIndicators.stochastic.d}
    - شاخص جهت‌گیری میانگین (ADX): ${cryptoData.technicalIndicators.adx}
    - میانگین واقعی دامنه (ATR): ${cryptoData.technicalIndicators.atr}
    - حجم تعادل (OBV): ${cryptoData.technicalIndicators.obv}
    - میانگین وزنی حجم (VWAP): ${this.formatPrice(cryptoData.technicalIndicators.vwap, cryptoInfo.symbol)}
    - ابر ایچیموکو: خط تبدیل=${this.formatPrice(cryptoData.technicalIndicators.ichimoku.conversionLine, cryptoInfo.symbol)}, خط پایه=${this.formatPrice(cryptoData.technicalIndicators.ichimoku.baseLine, cryptoInfo.symbol)}
    - شاخص ترس و طمع (لحظه‌ای): ${cryptoData.fearGreedIndex}
    - سطوح حمایت (محاسبه شده): ${formattedSupportLevels}
    - سطوح مقاومت (محاسبه شده): ${formattedResistanceLevels}
    - Point of Control (POC): ${this.formatPrice(cryptoData.technicalIndicators.volumeProfile.poc, cryptoInfo.symbol)}
    - Value Area High (VAH): ${this.formatPrice(cryptoData.technicalIndicators.volumeProfile.vah, cryptoInfo.symbol)}
    - Value Area Low (VAL): ${this.formatPrice(cryptoData.technicalIndicators.volumeProfile.val, cryptoInfo.symbol)}

    لطفاً تحلیل شامل موارد زیر باشد:
    1. وضعیت فعلی ${cryptoInfo.name} (صعودی، نزولی، یا خنثی) بر اساس داده‌های لحظه‌ای
    2. تحلیل تکنیکال دقیق با تمرکز بر زمان کوتاه مدت
    3. سیگنال‌های خرید و فروش فوری
    4. حد ضرر و هدف سود کوتاه مدت
    5. ریسک‌های کوتاه مدت
    6. پیشنهاد معاملاتی برای چند روز آینده
    7. تحلیل Order Blocks و تأثیر آن بر حرکت قیمت

    توجه: تمام داده‌های فوق لحظه‌ای و واقعی هستند و بر اساس آخرین اطلاعات بازار می‌باشند.

    پاسخ را به زبان فارسی و به صورت ساختاریافته با استفاده از مارک‌داون ارائه دهید. برای عناوین از ### و برای تاکید از ** استفاده کنید.`;
            } else {
                return `لطفاً یک تحلیل بلند مدت جامع برای ارز دیجیتال ${cryptoInfo.name} (${cryptoInfo.symbol}) ارائه دهید.

    تحلیل بلند مدت باید روی موارد زیر تمرکز کند:
    - روندهای بلندمدت قیمت
    - فاندامنتال و آینده پروژه
    - پتانسیل رشد در بلندمدت
    - تحلیل بازار و رقبا
    - پیش‌بینی قیمت برای ماه‌ها و سال‌های آینده
    - چرخه‌های بازار و احساسات
    - تأثیر رویدادهای آینده بر بلندمدت

    داده‌های لحظه‌ای و واقعی:
    - قیمت فعلی: $${formattedPrice}
    - تغییر قیمت 24 ساعته: ${cryptoData.priceChange24h.toFixed(2)}%
    - حجم معاملات 24 ساعته: $${(cryptoData.volume24h / 1000000000).toFixed(1)}B
    - ارزش بازار: $${(cryptoData.marketCap / 1000000000).toFixed(1)}B
    - عرضه در گردش: ${cryptoData.circulatingSupply ? cryptoData.circulatingSupply.toLocaleString() : 'نامشخص'}
    - حداکثر عرضه: ${cryptoData.maxSupply ? cryptoData.maxSupply.toLocaleString() : 'نامشخص'}
    - RSI (محاسبه شده): ${cryptoData.technicalIndicators.rsi}
    - MACD (محاسبه شده): ${cryptoData.technicalIndicators.macd}
    - SMA20 (محاسبه شده): $${formattedSMA20}
    - SMA50 (محاسبه شده): $${formattedSMA50}
    - باندهای بولینگر: بالا=${this.formatPrice(cryptoData.technicalIndicators.bollingerBands.upper, cryptoInfo.symbol)}, میانی=${this.formatPrice(cryptoData.technicalIndicators.bollingerBands.middle, cryptoInfo.symbol)}, پایین=${this.formatPrice(cryptoData.technicalIndicators.bollingerBands.lower, cryptoInfo.symbol)}
    - استوکاستیک: K=${cryptoData.technicalIndicators.stochastic.k}, D=${cryptoData.technicalIndicators.stochastic.d}
    - شاخص جهت‌گیری میانگین (ADX): ${cryptoData.technicalIndicators.adx}
    - میانگین واقعی دامنه (ATR): ${cryptoData.technicalIndicators.atr}
    - حجم تعادل (OBV): ${cryptoData.technicalIndicators.obv}
    - میانگین وزنی حجم (VWAP): ${this.formatPrice(cryptoData.technicalIndicators.vwap, cryptoInfo.symbol)}
    - ابر ایچیموکو: خط تبدیل=${this.formatPrice(cryptoData.technicalIndicators.ichimoku.conversionLine, cryptoInfo.symbol)}, خط پایه=${this.formatPrice(cryptoData.technicalIndicators.ichimoku.baseLine, cryptoInfo.symbol)}
    - شاخص ترس و طمع (لحظه‌ای): ${cryptoData.fearGreedIndex}
    - سطوح حمایت بلندمدت (محاسبه شده): ${formattedSupportLevels}
    - سطوح مقاومت بلندمدت (محاسبه شده): ${formattedResistanceLevels}
    - سطوح بازگشت فیبوناچی: ${cryptoData.technicalIndicators.fibonacci.levels.map(level => `${level.level}: ${this.formatPrice(level.price, cryptoInfo.symbol)}`).join(', ')}
    - Point of Control (POC): ${this.formatPrice(cryptoData.technicalIndicators.volumeProfile.poc, cryptoInfo.symbol)}
    - Value Area High (VAH): ${this.formatPrice(cryptoData.technicalIndicators.volumeProfile.vah, cryptoInfo.symbol)}
    - Value Area Low (VAL): ${this.formatPrice(cryptoData.technicalIndicators.volumeProfile.val, cryptoInfo.symbol)}

    لطفاً تحلیل شامل موارد زیر باشد:
    1. تحلیل فاندامنتال پروژه ${cryptoInfo.name}
    2. روندهای بلندمدت قیمت
    3. پتانسیل رشد در 6 ماه تا 2 سال آینده
    4. تحلیل رقبا و بازار
    5. عوامل موثر بر رشد بلندمدت
    6. پیش‌بینی قیمت برای دوره‌های زمانی مختلف
    7. استراتژی سرمایه‌گذاری بلندمدت
    8. ریسک‌ها و فرصت‌های بلندمدت
    9. تحلیل چرخه‌های بازار و احساسات فعلی
    10. تأثیر رویدادهای آتی (مانند هاوینگ، آپدیت‌های پروتکل و غیره)

    توجه: تمام داده‌های فوق لحظه‌ای و واقعی هستند و بر اساس آخرین اطلاعات بازار می‌باشند.

    پاسخ را به زبان فارسی و به صورت ساختاریافته با استفاده از مارک‌داون ارائه دهید. برای عناوین از ### و برای تاکید از ** استفاده کنید.`;
            }
        } else {
            if (this.analysisType === 'short') {
                return `Please provide a comprehensive short-term analysis for the cryptocurrency ${cryptoInfo.name} (${cryptoInfo.symbol}).

    Short-term analysis should focus on:
    - Technical analysis and immediate indicators
    - Price behavior and trading volume
    - Current fear and greed index
    - Short-term trading signals
    - Order Blocks and key short-term levels

    Real-time data:
    - Current price: $${formattedPrice}
    - 24h price change: ${cryptoData.priceChange24h.toFixed(2)}%
    - 24h trading volume: $${(cryptoData.volume24h / 1000000000).toFixed(1)}B
    - Market cap: $${(cryptoData.marketCap / 1000000000).toFixed(1)}B
    - RSI (calculated): ${cryptoData.technicalIndicators.rsi}
    - MACD (calculated): ${cryptoData.technicalIndicators.macd}
    - SMA20 (calculated): $${formattedSMA20}
    - SMA50 (calculated): $${formattedSMA50}
    - Bollinger Bands: upper=${this.formatPrice(cryptoData.technicalIndicators.bollingerBands.upper, cryptoInfo.symbol)}, middle=${this.formatPrice(cryptoData.technicalIndicators.bollingerBands.middle, cryptoInfo.symbol)}, lower=${this.formatPrice(cryptoData.technicalIndicators.bollingerBands.lower, cryptoInfo.symbol)}
    - Stochastic: K=${cryptoData.technicalIndicators.stochastic.k}, D=${cryptoData.technicalIndicators.stochastic.d}
    - Average Directional Index (ADX): ${cryptoData.technicalIndicators.adx}
    - Average True Range (ATR): ${cryptoData.technicalIndicators.atr}
    - On-Balance Volume (OBV): ${cryptoData.technicalIndicators.obv}
    - Volume Weighted Average Price (VWAP): ${this.formatPrice(cryptoData.technicalIndicators.vwap, cryptoInfo.symbol)}
    - Ichimoku Cloud: conversion line=${this.formatPrice(cryptoData.technicalIndicators.ichimoku.conversionLine, cryptoInfo.symbol)}, base line=${this.formatPrice(cryptoData.technicalIndicators.ichimoku.baseLine, cryptoInfo.symbol)}
    - Fear & Greed Index (real-time): ${cryptoData.fearGreedIndex}
    - Support levels (calculated): ${formattedSupportLevels}
    - Resistance levels (calculated): ${formattedResistanceLevels}
    - Point of Control (POC): ${this.formatPrice(cryptoData.technicalIndicators.volumeProfile.poc, cryptoInfo.symbol)}
    - Value Area High (VAH): ${this.formatPrice(cryptoData.technicalIndicators.volumeProfile.vah, cryptoInfo.symbol)}
    - Value Area Low (VAL): ${this.formatPrice(cryptoData.technicalIndicators.volumeProfile.val, cryptoInfo.symbol)}

    Please include:
    1. Current status of ${cryptoInfo.name} (bullish, bearish, or neutral) based on real-time data
    2. Detailed technical analysis with focus on short-term
    3. Immediate buy/sell signals
    4. Short-term stop loss and take profit levels
    5. Short-term risks
    6. Trading suggestion for the next few days
    7. Analysis of Order Blocks and their impact on price movement

    Note: All data above is real-time and based on the latest market information.

    Respond in English and use structured markdown. Use ### for headings and ** for emphasis.`;
            } else {
                return `Please provide a comprehensive long-term analysis for the cryptocurrency ${cryptoInfo.name} (${cryptoInfo.symbol}).

    Long-term analysis should focus on:
    - Long-term price trends
    - Project fundamentals and future
    - Growth potential in the long term
    - Market analysis and competitors
    - Price prediction for months and years ahead
    - Market cycles and sentiment
    - Impact of future events on long-term prospects

    Real-time data:
    - Current price: $${formattedPrice}
    - 24h price change: ${cryptoData.priceChange24h.toFixed(2)}%
    - 24h trading volume: $${(cryptoData.volume24h / 1000000000).toFixed(1)}B
    - Market cap: $${(cryptoData.marketCap / 1000000000).toFixed(1)}B
    - Circulating supply: ${cryptoData.circulatingSupply ? cryptoData.circulatingSupply.toLocaleString() : 'Unknown'}
    - Max supply: ${cryptoData.maxSupply ? cryptoData.maxSupply.toLocaleString() : 'Unknown'}
    - RSI (calculated): ${cryptoData.technicalIndicators.rsi}
    - MACD (calculated): ${cryptoData.technicalIndicators.macd}
    - SMA20 (calculated): $${formattedSMA20}
    - SMA50 (calculated): $${formattedSMA50}
    - Bollinger Bands: upper=${this.formatPrice(cryptoData.technicalIndicators.bollingerBands.upper, cryptoInfo.symbol)}, middle=${this.formatPrice(cryptoData.technicalIndicators.bollingerBands.middle, cryptoInfo.symbol)}, lower=${this.formatPrice(cryptoData.technicalIndicators.bollingerBands.lower, cryptoInfo.symbol)}
    - Stochastic: K=${cryptoData.technicalIndicators.stochastic.k}, D=${cryptoData.technicalIndicators.stochastic.d}
    - Average Directional Index (ADX): ${cryptoData.technicalIndicators.adx}
    - Average True Range (ATR): ${cryptoData.technicalIndicators.atr}
    - On-Balance Volume (OBV): ${cryptoData.technicalIndicators.obv}
    - Volume Weighted Average Price (VWAP): ${this.formatPrice(cryptoData.technicalIndicators.vwap, cryptoInfo.symbol)}
    - Ichimoku Cloud: conversion line=${this.formatPrice(cryptoData.technicalIndicators.ichimoku.conversionLine, cryptoInfo.symbol)}, base line=${this.formatPrice(cryptoData.technicalIndicators.ichimoku.baseLine, cryptoInfo.symbol)}
    - Fear & Greed Index (real-time): ${cryptoData.fearGreedIndex}
    - Long-term support levels (calculated): ${formattedSupportLevels}
    - Long-term resistance levels (calculated): ${formattedResistanceLevels}
    - Fibonacci retracement levels: ${cryptoData.technicalIndicators.fibonacci.levels.map(level => `${level.level}: ${this.formatPrice(level.price, cryptoInfo.symbol)}`).join(', ')}
    - Point of Control (POC): ${this.formatPrice(cryptoData.technicalIndicators.volumeProfile.poc, cryptoInfo.symbol)}
    - Value Area High (VAH): ${this.formatPrice(cryptoData.technicalIndicators.volumeProfile.vah, cryptoInfo.symbol)}
    - Value Area Low (VAL): ${this.formatPrice(cryptoData.technicalIndicators.volumeProfile.val, cryptoInfo.symbol)}

    Please include:
    1. Fundamental analysis of ${cryptoInfo.name} project
    2. Long-term price trends
    3. Growth potential in the next 6 months to 2 years
    4. Competitors and market analysis
    5. Factors affecting long-term growth
    6. Price prediction for different time periods
    7. Long-term investment strategy
    8. Long-term risks and opportunities
    9. Analysis of market cycles and current sentiment
    10. Impact of upcoming events (like halving, protocol updates, etc.)

    Note: All data above is real-time and based on the latest market information.

    Respond in English and use structured markdown. Use ### for headings and ** for emphasis.`;
            }
        }
    }

    // Amirreza is Best ;)

displayResults(analysis) {
    document.getElementById('analysisStatus').style.display = 'none';
    document.getElementById('analysisResults').style.display = 'block';

    const cryptoData = this.cryptoData;
    const cryptoInfo = this.cryptoInfo;

    // نمایش اطلاعات ارز
    this.displayCryptoInfo(cryptoInfo, cryptoData);

    // نمایش خلاصه تحلیل
    this.displaySummary(cryptoInfo, cryptoData);

    // نمایش نمودار زنده
    this.displayLiveChart(cryptoInfo);

    // نمایش شاخص‌ها
    this.displayIndicators(cryptoData.technicalIndicators, cryptoData.fearGreedIndex);

    // نمایش سطوح حمایت و مقاومت
    this.displayLevels();

    // نمایش پروفایل حجم
    this.displayVolumeProfile();

    // نمایش سطوح فیبوناچی
    this.displayFibonacciLevels();

    // نمایش تحلیل کامل با پشتیبانی از مارک‌داون
    this.displayAnalysisWithMarkdown(analysis);

    // استخراج پیشنهاد معاملاتی از تحلیل
    this.extractRecommendation(analysis);
}

displayCryptoInfo(cryptoInfo, cryptoData) {
    const cryptoInfoContent = document.getElementById('cryptoInfoContent');
    
    // استفاده از تابع جدید برای فرمت‌بندی قیمت
    const formattedPrice = this.formatPrice(cryptoData.price, cryptoInfo.symbol);
    const formattedVolume = (cryptoData.volume24h / 1000000000).toFixed(1);
    const formattedMarketCap = (cryptoData.marketCap / 1000000000).toFixed(1);
    
    cryptoInfoContent.innerHTML = `
        <div class="crypto-info-item">
            <div class="label">${this.currentLanguage === 'fa' ? 'نام ارز' : 'Currency Name'}</div>
            <div class="value">${cryptoInfo.name}</div>
        </div>
        <div class="crypto-info-item">
            <div class="label">${this.currentLanguage === 'fa' ? 'نماد' : 'Symbol'}</div>
            <div class="value">${cryptoInfo.symbol}</div>
        </div>
        <div class="crypto-info-item">
            <div class="label">${this.currentLanguage === 'fa' ? 'قیمت فعلی' : 'Current Price'}</div>
            <div class="value">$${formattedPrice}</div>
        </div>
        <div class="crypto-info-item">
            <div class="label">${this.currentLanguage === 'fa' ? 'تغییر 24h' : '24h Change'}</div>
            <div class="value ${cryptoData.priceChange24h >= 0 ? 'positive' : 'negative'}">${cryptoData.priceChange24h.toFixed(2)}%</div>
        </div>
        <div class="crypto-info-item">
            <div class="label">${this.currentLanguage === 'fa' ? 'حجم 24h' : '24h Volume'}</div>
            <div class="value">$${formattedVolume}B</div>
        </div>
        <div class="crypto-info-item">
            <div class="label">${this.currentLanguage === 'fa' ? 'ارزش بازار' : 'Market Cap'}</div>
            <div class="value">$${formattedMarketCap}B</div>
        </div>
    `;
}

displaySummary(cryptoInfo, cryptoData) {
    const summaryContent = document.getElementById('summaryContent');
    const trend = cryptoData.priceChange24h >= 0 ? 
        (this.currentLanguage === 'fa' ? 'صعودی 📈' : 'Bullish 📈') : 
        (this.currentLanguage === 'fa' ? 'نزولی 📉' : 'Bearish 📉');
    const analysisType = this.analysisType === 'short' ? 
        (this.currentLanguage === 'fa' ? 'کوتاه مدت' : 'Short-term') : 
        (this.currentLanguage === 'fa' ? 'بلند مدت' : 'Long-term');
    
    // استفاده از تابع جدید برای فرمت‌بندی قیمت
    const formattedPrice = this.formatPrice(cryptoData.price, cryptoInfo.symbol);
    
    summaryContent.innerHTML = `
        <p><strong>${this.currentLanguage === 'fa' ? 'نوع تحلیل:' : 'Analysis Type:'}</strong> ${analysisType}</p>
        <p><strong>${this.currentLanguage === 'fa' ? 'وضعیت فعلی:' : 'Current Status:'}</strong> ${trend}</p>
        <p><strong>${this.currentLanguage === 'fa' ? 'قیمت فعلی:' : 'Current Price:'}</strong> $${formattedPrice}</p>
        <p><strong>${this.currentLanguage === 'fa' ? 'تغییر 24 ساعته:' : '24h Change:'}</strong> <span class="${cryptoData.priceChange24h >= 0 ? 'positive' : 'negative'}">${cryptoData.priceChange24h.toFixed(2)}%</span></p>
        <p><strong>${this.currentLanguage === 'fa' ? 'شاخص ترس و طمع:' : 'Fear & Greed Index:'}</strong> ${cryptoData.fearGreedIndex} (${this.getFearGreedText(cryptoData.fearGreedIndex)})</p>
        <p><strong>${this.currentLanguage === 'fa' ? 'تحلیل کلی:' : 'Overall Analysis:'}</strong> ${this.getGeneralAnalysis(cryptoData)}</p>
    `;
}

displayLiveChart(cryptoInfo) {
    const liveChartContainer = document.getElementById('liveChartContainer');
    
    // استفاده از TradingView widget برای نمودار زنده
    liveChartContainer.innerHTML = `
        <iframe 
            src="https://www.tradingview.com/widgetembed/?frameElementId=tradingview_widget&symbol=${cryptoInfo.tradingViewSymbol}&interval=240&hidesidetoolbar=1&hidetoptoolbar=1&symboledit=1&saveimage=1&toolbarbg=F1F3F6&studies=[]&hideideas=1&theme=dark&style=10&timezone=Etc/UTC&studies_overrides={}&overrides={}&enabled_features=[]&disabled_features=[]&locale=${this.currentLanguage === 'fa' ? 'fa_IR' : 'en'}&utm_source=&utm_medium=widget&utm_campaign=chart&utm_term=${cryptoInfo.tradingViewSymbol}"
            frameborder="0"
            allowtransparency="true"
            scrolling="no"
            allowfullscreen>
        </iframe>
    `;
}

displayIndicators() {
    const indicatorsGrid = document.getElementById('indicatorsGrid');
    
    // استفاده از تابع جدید برای فرمت‌بندی قیمت در شاخص‌ها
    const formattedSMA20 = this.formatSmallNumber(this.cryptoData.technicalIndicators.sma20);
    const formattedSMA50 = this.formatSmallNumber(this.cryptoData.technicalIndicators.sma50);
    const formattedEMA12 = this.formatSmallNumber(this.cryptoData.technicalIndicators.ema12);
    const formattedEMA26 = this.formatSmallNumber(this.cryptoData.technicalIndicators.ema26);
    const formattedVWAP = this.formatPrice(this.cryptoData.technicalIndicators.vwap, this.cryptoInfo.symbol);
    
    indicatorsGrid.innerHTML = `
        <div class="indicator-item">
            <div class="name">RSI</div>
            <div class="value ${this.getRSIClass(this.cryptoData.technicalIndicators.rsi)}">${this.cryptoData.technicalIndicators.rsi}</div>
        </div>
        <div class="indicator-item">
            <div class="name">MACD</div>
            <div class="value ${this.cryptoData.technicalIndicators.macd >= 0 ? 'positive' : 'negative'}">${this.formatSmallNumber(this.cryptoData.technicalIndicators.macd)}</div>
        </div>
        <div class="indicator-item">
            <div class="name">SMA20</div>
            <div class="value">$${formattedSMA20}</div>
        </div>
        <div class="indicator-item">
            <div class="name">SMA50</div>
            <div class="value">$${formattedSMA50}</div>
        </div>
        <div class="indicator-item">
            <div class="name">EMA12</div>
            <div class="value">$${formattedEMA12}</div>
        </div>
        <div class="indicator-item">
            <div class="name">EMA26</div>
            <div class="value">$${formattedEMA26}</div>
        </div>
        <div class="indicator-item">
            <div class="name">VWAP</div>
            <div class="value">$${formattedVWAP}</div>
        </div>
        <div class="indicator-item">
            <div class="name">${this.currentLanguage === 'fa' ? 'شاخص ترس و طمع' : 'Fear & Greed Index'}</div>
            <div class="value ${this.getFearGreedClass(this.cryptoData.fearGreedIndex)}">${this.cryptoData.fearGreedIndex}</div>
        </div>
        <div class="indicator-item">
            <div class="name">Stochastic</div>
            <div class="value ${this.getStochasticClass(this.cryptoData.technicalIndicators.stochastic.k)}">${this.cryptoData.technicalIndicators.stochastic.k}/${this.cryptoData.technicalIndicators.stochastic.d}</div>
        </div>
        <div class="indicator-item">
            <div class="name">ADX</div>
            <div class="value ${this.getADXClass(this.cryptoData.technicalIndicators.adx)}">${this.cryptoData.technicalIndicators.adx}</div>
        </div>
    `;
}

// توابع کمکی جدید برای کلاس‌بندی اندیکاتورها
getStochasticClass(kValue) {
    if (kValue > 80) return 'overbought';
    if (kValue < 20) return 'oversold';
    return 'neutral';
}

getADXClass(adxValue) {
    if (adxValue > 25) return 'strong';
    if (adxValue > 20) return 'moderate';
    return 'weak';
}

displayLevels() {
    const levelsContent = document.getElementById('levelsContent');
    
    // سطوح حمایت و مقاومت بر اساس نوع تحلیل
    const supportLevels = this.analysisType === 'short' ? 
        this.cryptoData.supportLevelsShort : this.cryptoData.supportLevelsLong;
    const resistanceLevels = this.analysisType === 'short' ? 
        this.cryptoData.resistanceLevelsShort : this.cryptoData.resistanceLevelsLong;
    
    // استفاده از تابع جدید برای فرمت‌بندی سطوح
    const formattedSupportLevels = supportLevels.map(level => this.formatPrice(level.price, this.cryptoInfo.symbol));
    const formattedResistanceLevels = resistanceLevels.map(level => this.formatPrice(level.price, this.cryptoInfo.symbol));
    
    levelsContent.innerHTML = `
        <div class="level-group">
            <h4>${this.currentLanguage === 'fa' ? 'سطوح حمایت' : 'Support Levels'}</h4>
            ${supportLevels.map((level, index) => `
                <div class="level-item ${level.type === 'orderblock' ? 'orderblock' : ''}">
                    <span class="level-name">${this.currentLanguage === 'fa' ? `حمایت ${index + 1}` : `Support ${index + 1}`}</span>
                    <span class="level-value">$${formattedSupportLevels[index]}</span>
                    <span class="level-strength">${(level.strength * 100).toFixed(0)}%</span>
                    ${level.type === 'orderblock' ? '<span class="level-type">Order Block</span>' : ''}
                </div>
            `).join('')}
        </div>
        <div class="level-group">
            <h4>${this.currentLanguage === 'fa' ? 'سطوح مقاومت' : 'Resistance Levels'}</h4>
            ${resistanceLevels.map((level, index) => `
                <div class="level-item ${level.type === 'orderblock' ? 'orderblock' : ''}">
                    <span class="level-name">${this.currentLanguage === 'fa' ? `مقاومت ${index + 1}` : `Resistance ${index + 1}`}</span>
                    <span class="level-value">$${formattedResistanceLevels[index]}</span>
                    <span class="level-strength">${(level.strength * 100).toFixed(0)}%</span>
                    ${level.type === 'orderblock' ? '<span class="level-type">Order Block</span>' : ''}
                </div>
            `).join('')}
        </div>
    `;
}

displayAnalysisWithMarkdown(analysis) {
    const fullAnalysisContent = document.getElementById('fullAnalysisContent');
    
    // استفاده از کتابخانه marked برای تبدیل مارک‌داون به HTML
    const htmlContent = marked.parse(analysis);
    
    // اعمال استایل‌های سفارشی برای خروجی بهتر
    const styledContent = htmlContent
        .replace(/<h1>/g, '<h1 style="color: #333; font-size: 1.8rem; margin-bottom: 20px;">')
        .replace(/<h2>/g, '<h2 style="color: #333; font-size: 1.5rem; margin-bottom: 15px;">')
        .replace(/<h3>/g, '<h3 style="color: #333; font-size: 1.3rem; margin-bottom: 12px;">')
        .replace(/<h4>/g, '<h4 style="color: #333; font-size: 1.1rem; margin-bottom: 10px;">')
        .replace(/<strong>/g, '<strong style="color: #333; font-weight: 700;">')
        .replace(/<ul>/g, '<ul style="margin-bottom: 15px; padding-right: 20px;">')
        .replace(/<ol>/g, '<ol style="margin-bottom: 15px; padding-right: 20px;">')
        .replace(/<li>/g, '<li style="margin-bottom: 8px;">')
        .replace(/<p>/g, '<p style="margin-bottom: 15px; line-height: 1.8;">');
    
    fullAnalysisContent.innerHTML = styledContent;
}

extractRecommendation(analysis) {
    const recommendationContent = document.getElementById('recommendationContent');
    
    // استفاده از تابع جدید برای فرمت‌بندی قیمت در پیشنهادات
    const currentPrice = this.cryptoData.price;
    const formattedStopLoss = this.formatPrice(currentPrice * 0.95, this.cryptoInfo.symbol);
    const formattedTakeProfit = this.formatPrice(currentPrice * 1.08, this.cryptoInfo.symbol);
    const formattedLongTermStopLoss = this.formatPrice(currentPrice * 0.7, this.cryptoInfo.symbol);
    const formattedLongTermTarget = this.formatPrice(currentPrice * 2, this.cryptoInfo.symbol);
    
    // استخراج پیشنهاد بر اساس نوع تحلیل
    if (this.analysisType === 'short') {
        recommendationContent.innerHTML = `
            <div class="recommendation-item">
                <span class="label">${this.currentLanguage === 'fa' ? 'پیشنهاد معاملاتی:' : 'Trading Suggestion:'}</span>
                <span class="value positive">${this.currentLanguage === 'fa' ? 'لانگ (خرید)' : 'Long (Buy)'}</span>
            </div>
            <div class="recommendation-item">
                <span class="label">${this.currentLanguage === 'fa' ? 'حد ضرر:' : 'Stop Loss:'}</span>
                <span class="value">$${formattedStopLoss}</span>
            </div>
            <div class="recommendation-item">
                <span class="label">${this.currentLanguage === 'fa' ? 'هدف سود:' : 'Take Profit:'}</span>
                <span class="value">$${formattedTakeProfit}</span>
            </div>
            <div class="recommendation-item">
                <span class="label">${this.currentLanguage === 'fa' ? 'ریسک:' : 'Risk:'}</span>
                <span class="value neutral">${this.currentLanguage === 'fa' ? 'متوسط' : 'Medium'}</span>
            </div>
            <div class="recommendation-item">
                <span class="label">${this.currentLanguage === 'fa' ? 'زمان‌بندی:' : 'Timing:'}</span>
                <span class="value">${this.currentLanguage === 'fa' ? '1-7 روز' : '1-7 days'}</span>
            </div>
        `;
    } else {
        recommendationContent.innerHTML = `
            <div class="recommendation-item">
                <span class="label">${this.currentLanguage === 'fa' ? 'پیشنهاد سرمایه‌گذاری:' : 'Investment Suggestion:'}</span>
                <span class="value positive">${this.currentLanguage === 'fa' ? 'هولد (نگهداری)' : 'Hold'}</span>
            </div>
            <div class="recommendation-item">
                <span class="label">${this.currentLanguage === 'fa' ? 'حد ضرر بلندمدت:' : 'Long-term Stop Loss:'}</span>
                <span class="value">$${formattedLongTermStopLoss}</span>
            </div>
            <div class="recommendation-item">
                <span class="label">${this.currentLanguage === 'fa' ? 'هدف بلندمدت:' : 'Long-term Target:'}</span>
                <span class="value">$${formattedLongTermTarget}</span>
            </div>
            <div class="recommendation-item">
                <span class="label">${this.currentLanguage === 'fa' ? 'ریسک بلندمدت:' : 'Long-term Risk:'}</span>
                <span class="value neutral">${this.currentLanguage === 'fa' ? 'کم تا متوسط' : 'Low to Medium'}</span>
            </div>
            <div class="recommendation-item">
                <span class="label">${this.currentLanguage === 'fa' ? 'زمان‌بندی:' : 'Timing:'}</span>
                <span class="value">${this.currentLanguage === 'fa' ? '6-24 ماه' : '6-24 months'}</span>
            </div>
        `;
    }
}

getRSIClass(rsi) {
    if (rsi > 70) return 'negative';
    if (rsi < 30) return 'positive';
    return 'neutral';
}

getFearGreedClass(index) {
    if (index > 75) return 'negative';
    if (index < 25) return 'positive';
    return 'neutral';
}

getFearGreedText(index) {
    if (this.currentLanguage === 'fa') {
        if (index > 75) return 'طمع شدید';
        if (index > 50) return 'طمع';
        if (index > 25) return 'ترس';
        return 'ترس شدید';
    } else {
        if (index > 75) return 'Extreme Greed';
        if (index > 50) return 'Greed';
        if (index > 25) return 'Fear';
        return 'Extreme Fear';
    }
}

getGeneralAnalysis(cryptoData) {
    if (this.currentLanguage === 'fa') {
        if (cryptoData.priceChange24h > 3) {
            return 'روند صعودی قوی با پتانسیل ادامه رشد';
        } else if (cryptoData.priceChange24h > 0) {
            return 'روند صعودی ملایم با نیاز به تأیید بیشتر';
        } else if (cryptoData.priceChange24h > -3) {
            return 'روند نزولی ملایم با امکان اصلاح';
        } else {
            return 'روند نزولی قوی با نیاز به احتیاط';
        }
    } else {
        if (cryptoData.priceChange24h > 3) {
            return 'Strong bullish trend with potential for continued growth';
        } else if (cryptoData.priceChange24h > 0) {
            return 'Mild bullish trend requiring further confirmation';
        } else if (cryptoData.priceChange24h > -3) {
            return 'Mild bearish trend with potential for correction';
        } else {
            return 'Strong bearish trend requiring caution';
        }
    }
}

    showError(message) {
        alert(message);
    }

    copyResults() {
        const results = document.getElementById('fullAnalysisContent').innerText;
        navigator.clipboard.writeText(results).then(() => {
            alert(this.currentLanguage === 'fa' ? 
                'نتایج با موفقیت کپی شد' : 
                'Results copied successfully');
        });
    }

    downloadPDF() {
        alert(this.currentLanguage === 'fa' ? 
            'در نسخه نمایشی فعال نیست' : 
            'Not available in demo version');
    }

    shareResults() {
        if (navigator.share) {
            navigator.share({
                title: this.currentLanguage === 'fa' ? 
                    'تحلیل هوشمند ارز دیجیتال' : 
                    'Smart Crypto Analysis',
                text: document.getElementById('fullAnalysisContent').innerText,
                url: window.location.href
            });
        } else {
            alert(this.currentLanguage === 'fa' ? 
                'مرورگر شما از اشتراک گذاری پشتیبانی نمی‌کند' : 
                'Your browser does not support sharing');
        }
    }
}

// مقداردهی اولیه
document.addEventListener('DOMContentLoaded', () => {
    new CryptoAnalyzer();
});