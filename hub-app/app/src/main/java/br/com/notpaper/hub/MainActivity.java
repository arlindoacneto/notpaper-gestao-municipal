package br.com.notpaper.hub;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.ProgressBar;
import android.widget.TextView;

/**
 * NotPaper Hub — apresentação interativa em modo quiosque.
 *
 * - hubView: carrega o HUB local (assets/index.html), funciona offline.
 * - systemView: abre o sistema escolhido dentro do próprio app, com o botão
 *   flutuante "Voltar ao HUB" e retorno automático por inatividade.
 */
public class MainActivity extends Activity {

    private static final String HUB_URL = "file:///android_asset/index.html";

    private WebView hubView;
    private FrameLayout systemLayer;
    private WebView systemView;
    private ProgressBar progress;

    private final Handler handler = new Handler(Looper.getMainLooper());
    private long systemIdleMs = 0;
    private final Runnable backToHub = this::closeSystem;

    @SuppressLint({"SetJavaScriptEnabled", "AddJavascriptInterface"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.parseColor("#030A26"));

        // ---- HUB local ----
        hubView = new WebView(this);
        hubView.setBackgroundColor(Color.parseColor("#030A26"));
        WebSettings hs = hubView.getSettings();
        hs.setJavaScriptEnabled(true);
        hs.setDomStorageEnabled(true);
        hs.setAllowFileAccess(true);
        hs.setMediaPlaybackRequiresUserGesture(false);
        hubView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        hubView.setVerticalScrollBarEnabled(false);
        hubView.setHorizontalScrollBarEnabled(false);
        hubView.addJavascriptInterface(new Bridge(), "NotPaperHubNative");
        hubView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri u = request.getUrl();
                if ("file".equals(u.getScheme())) return false;
                openSystem(u.toString(), systemIdleMs);
                return true;
            }
        });
        root.addView(hubView, match());

        // ---- Camada do sistema externo ----
        systemLayer = new FrameLayout(this);
        systemLayer.setBackgroundColor(Color.WHITE);
        systemLayer.setVisibility(View.GONE);

        systemView = new WebView(this);
        WebSettings ss = systemView.getSettings();
        ss.setJavaScriptEnabled(true);
        ss.setDomStorageEnabled(true);
        ss.setLoadWithOverviewMode(true);
        ss.setUseWideViewPort(true);
        ss.setBuiltInZoomControls(true);
        ss.setDisplayZoomControls(false);
        systemView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String s = request.getUrl().getScheme();
                return !("http".equals(s) || "https".equals(s)); // mantém a navegação dentro do app
            }
        });
        systemView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int p) {
                progress.setProgress(p);
                progress.setVisibility(p >= 100 ? View.GONE : View.VISIBLE);
            }
        });
        systemLayer.addView(systemView, match());

        progress = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
        progress.setMax(100);
        progress.setIndeterminate(false);
        systemLayer.addView(progress, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(4), Gravity.TOP));

        TextView back = new TextView(this);
        back.setText("\u2190  Voltar ao HUB");
        back.setTextColor(Color.WHITE);
        back.setTextSize(TypedValue.COMPLEX_UNIT_SP, 18);
        back.setPadding(dp(26), dp(14), dp(26), dp(14));
        GradientDrawable bg = new GradientDrawable(GradientDrawable.Orientation.LEFT_RIGHT,
                new int[]{Color.parseColor("#2F6BFF"), Color.parseColor("#0A3FE0")});
        bg.setCornerRadius(dp(40));
        back.setBackground(bg);
        back.setElevation(dp(10));
        back.setOnClickListener(v -> closeSystem());
        FrameLayout.LayoutParams blp = new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT, Gravity.BOTTOM | Gravity.CENTER_HORIZONTAL);
        blp.bottomMargin = dp(28);
        systemLayer.addView(back, blp);

        root.addView(systemLayer, match());
        setContentView(root);

        hubView.loadUrl(HUB_URL);
        immersive();
    }

    /** Ponte JavaScript -> Android (usada por hub.js). */
    private class Bridge {
        @JavascriptInterface
        public void openSystem(final String url, final String idleSeconds) {
            long secs = 0;
            try { secs = Long.parseLong(idleSeconds); } catch (Exception ignored) { }
            final long ms = secs * 1000L;
            runOnUiThread(() -> MainActivity.this.openSystem(url, ms));
        }
    }

    private void openSystem(String url, long idleMs) {
        if (url == null || !(url.startsWith("https://") || url.startsWith("http://"))) return;
        systemIdleMs = idleMs;
        systemView.clearHistory();
        systemView.loadUrl(url);
        systemLayer.setVisibility(View.VISIBLE);
        armIdle();
    }

    private void closeSystem() {
        handler.removeCallbacks(backToHub);
        if (systemLayer.getVisibility() != View.VISIBLE) return;
        systemLayer.setVisibility(View.GONE);
        systemView.stopLoading();
        systemView.loadUrl("about:blank");
        systemView.clearHistory();
        hubView.evaluateJavascript("window.hubHome && window.hubHome();", null);
        immersive();
    }

    private void armIdle() {
        handler.removeCallbacks(backToHub);
        if (systemIdleMs > 0 && systemLayer.getVisibility() == View.VISIBLE) {
            handler.postDelayed(backToHub, systemIdleMs);
        }
    }

    @Override
    public boolean dispatchTouchEvent(MotionEvent ev) {
        if (ev.getAction() == MotionEvent.ACTION_DOWN) armIdle();
        return super.dispatchTouchEvent(ev);
    }

    @SuppressWarnings("deprecation")
    @Override
    public void onBackPressed() {
        if (systemLayer.getVisibility() == View.VISIBLE) {
            if (systemView.canGoBack()) systemView.goBack();
            else closeSystem();
            return;
        }
        // No HUB: fecha o painel de detalhe, se aberto; na tela inicial, não sai do app.
        hubView.evaluateJavascript("window.hubBack && window.hubBack();", null);
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) immersive();
    }

    @SuppressWarnings("deprecation")
    private void immersive() {
        if (Build.VERSION.SDK_INT >= 30) {
            getWindow().setDecorFitsSystemWindows(false);
            WindowInsetsController c = getWindow().getInsetsController();
            if (c != null) {
                c.hide(WindowInsets.Type.statusBars() | WindowInsets.Type.navigationBars());
                c.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
            }
        } else {
            getWindow().getDecorView().setSystemUiVisibility(
                    View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY | View.SYSTEM_UI_FLAG_FULLSCREEN
                            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);
        }
    }

    @Override
    protected void onDestroy() {
        handler.removeCallbacksAndMessages(null);
        if (systemView != null) systemView.destroy();
        if (hubView != null) hubView.destroy();
        super.onDestroy();
    }

    private FrameLayout.LayoutParams match() {
        return new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
    }

    private int dp(int v) {
        return Math.round(TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, v, getResources().getDisplayMetrics()));
    }
}
