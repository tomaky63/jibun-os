Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = "Stop"
$root = (Get-Location).Path
$characters = Join-Path $root "public\characters"
$output = Join-Path $root "public\ogp"
New-Item -ItemType Directory -Force -Path $output | Out-Null

$types = @(
  @{ slug="sol"; codename="SOL"; name="太陽"; epithet="みんなを進ませる旗振り役"; family="前進系"; color="#FFB300" },
  @{ slug="comet"; codename="COMET"; name="彗星"; epithet="勢いで道をひらく突破者"; family="前進系"; color="#FF6B35" },
  @{ slug="lighthouse"; codename="LIGHTHOUSE"; name="灯台"; epithet="黙々と積み上げる完遂者"; family="前進系"; color="#F4D06F" },
  @{ slug="meteor"; codename="METEOR"; name="流星"; epithet="一点突破のハンター"; family="前進系"; color="#FF4E50" },
  @{ slug="prism"; codename="PRISM"; name="プリズム"; epithet="要点を照らす参謀"; family="探究系"; color="#4FC3F7" },
  @{ slug="spark"; codename="SPARK"; name="火花"; epithet="議論で燃える知的触媒"; family="探究系"; color="#00B0FF" },
  @{ slug="polaris"; codename="POLARIS"; name="北極星"; epithet="ぶれない基準を持つ研究者"; family="探究系"; color="#8C9EFF" },
  @{ slug="nebula"; codename="NEBULA"; name="星雲"; epithet="頭の中に宇宙がある仮説家"; family="探究系"; color="#5C6BC0" },
  @{ slug="lantern"; codename="LANTERN"; name="ランタン"; epithet="場を照らす世話役"; family="共鳴系"; color="#FFB74D" },
  @{ slug="bonfire"; codename="BONFIRE"; name="焚き火"; epithet="人が集まるムードメーカー"; family="共鳴系"; color="#FF8A50" },
  @{ slug="luna"; codename="LUNA"; name="月"; epithet="静かに支える番人"; family="共鳴系"; color="#E6E9F0" },
  @{ slug="hotaru"; codename="HOTARU"; name="蛍"; epithet="感受性のアンテナを持つ観察者"; family="共鳴系"; color="#A8E063" },
  @{ slug="kaleido"; codename="KALEIDO"; name="万華鏡"; epithet="世界観を設計する演出家"; family="創造系"; color="#AB47BC" },
  @{ slug="hanabi"; codename="HANABI"; name="花火"; epithet="瞬間を爆発させる表現者"; family="創造系"; color="#EC407A" },
  @{ slug="crystal"; codename="CRYSTAL"; name="結晶"; epithet="細部に美を宿らせる職人"; family="創造系"; color="#B39DDB" },
  @{ slug="aurora"; codename="AURORA"; name="オーロラ"; epithet="ひとり空想の発明家"; family="創造系"; color="#64FFDA" }
)

function New-Font([float]$size, [System.Drawing.FontStyle]$style) {
  return [System.Drawing.Font]::new("Yu Gothic", $size, $style, [System.Drawing.GraphicsUnit]::Pixel)
}

foreach ($type in $types) {
  $sourcePath = Join-Path $characters ($type.slug + ".png")
  if (-not (Test-Path $sourcePath)) { throw "Missing character image: $sourcePath" }

  $source = [System.Drawing.Image]::FromFile($sourcePath)
  $canvas = [System.Drawing.Bitmap]::new(1200, 630, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($canvas)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

  try {
    $g.Clear([System.Drawing.ColorTranslator]::FromHtml("#0B1026"))

    # Use the GPT Image 2 artwork as both atmospheric field and foreground subject.
    $g.DrawImage($source, [System.Drawing.Rectangle]::new(0, -285, 1200, 1200))
    $shade = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
      [System.Drawing.Point]::new(310, 0),
      [System.Drawing.Point]::new(980, 0),
      [System.Drawing.Color]::FromArgb(22, 11, 16, 38),
      [System.Drawing.Color]::FromArgb(246, 11, 16, 38)
    )
    $g.FillRectangle($shade, 300, 0, 900, 630)
    $shade.Dispose()
    $g.DrawImage($source, [System.Drawing.Rectangle]::new(18, 53, 524, 524))

    $gold = [System.Drawing.ColorTranslator]::FromHtml("#E8C97A")
    $accent = [System.Drawing.ColorTranslator]::FromHtml($type.color)
    $white = [System.Drawing.ColorTranslator]::FromHtml("#F7F4EC")
    $muted = [System.Drawing.ColorTranslator]::FromHtml("#C5CADB")
    $frame1 = [System.Drawing.Pen]::new($gold, 3)
    $frame2 = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(130, $gold), 1)
    $g.DrawRectangle($frame1, 18, 18, 1163, 593)
    $g.DrawRectangle($frame2, 29, 29, 1141, 571)
    $accentPen = [System.Drawing.Pen]::new($accent, 4)
    $g.DrawLine($accentPen, 578, 176, 1080, 176)

    $fontCode = New-Font 73 ([System.Drawing.FontStyle]::Bold)
    $fontJa = New-Font 35 ([System.Drawing.FontStyle]::Bold)
    $fontEpithet = New-Font 27 ([System.Drawing.FontStyle]::Regular)
    $fontSmall = New-Font 20 ([System.Drawing.FontStyle]::Bold)
    $fontHash = New-Font 21 ([System.Drawing.FontStyle]::Regular)
    $goldBrush = [System.Drawing.SolidBrush]::new($gold)
    $whiteBrush = [System.Drawing.SolidBrush]::new($white)
    $mutedBrush = [System.Drawing.SolidBrush]::new($muted)
    $accentBrush = [System.Drawing.SolidBrush]::new($accent)

    $g.DrawString($type.codename, $fontCode, $whiteBrush, 575, 88)
    $g.DrawString($type.name, $fontJa, $accentBrush, 578, 212)
    $g.DrawString($type.epithet, $fontEpithet, $whiteBrush, [System.Drawing.RectangleF]::new(578, 282, 520, 110))
    $g.DrawString("PERSONALITY OS", $fontSmall, $goldBrush, 580, 420)
    $g.DrawString($type.family + "  /  " + $type.codename, $fontSmall, $mutedBrush, 580, 461)
    $g.DrawString("#じぶんOS", $fontHash, $goldBrush, 580, 530)

    $outPath = Join-Path $output ($type.slug + ".png")
    $canvas.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

    @($frame1, $frame2, $accentPen, $fontCode, $fontJa, $fontEpithet, $fontSmall, $fontHash,
      $goldBrush, $whiteBrush, $mutedBrush, $accentBrush) | ForEach-Object { $_.Dispose() }
  }
  finally {
    $g.Dispose()
    $canvas.Dispose()
    $source.Dispose()
  }
}

Write-Output ("Generated {0} OGP images in {1}" -f $types.Count, $output)
