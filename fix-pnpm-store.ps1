$remainingFiles = @(
    "D:\Divine Bytes\node_modules\.pnpm\@babel+types@7.29.8\node_modules\@babel\types\package.json",
    "D:\Divine Bytes\node_modules\.pnpm\is-string@1.1.1\node_modules\is-string\package.json",
    "D:\Divine Bytes\node_modules\.pnpm\isexe@2.0.0\node_modules\isexe\package.json",
    "D:\Divine Bytes\node_modules\.pnpm\iterator.prototype@1.1.5\node_modules\iterator.prototype\package.json",
    "D:\Divine Bytes\node_modules\.pnpm\math-intrinsics@1.1.0\node_modules\math-intrinsics\package.json",
    "D:\Divine Bytes\node_modules\.pnpm\node-exports-info@1.6.2\node_modules\node-exports-info\package.json",
    "D:\Divine Bytes\node_modules\.pnpm\object-keys@1.1.1\node_modules\object-keys\package.json",
    "D:\Divine Bytes\node_modules\.pnpm\react-is@16.13.1\node_modules\react-is\package.json",
    "D:\Divine Bytes\node_modules\.pnpm\regexp.prototype.flags@1.5.4\node_modules\regexp.prototype.flags\package.json",
    "D:\Divine Bytes\node_modules\.pnpm\set-function-name@2.0.2\node_modules\set-function-name\package.json",
    "D:\Divine Bytes\node_modules\.pnpm\shebang-regex@3.0.0\node_modules\shebang-regex\package.json",
    "D:\Divine Bytes\node_modules\.pnpm\side-channel@1.1.1\node_modules\side-channel\package.json",
    "D:\Divine Bytes\node_modules\.pnpm\strip-bom@3.0.0\node_modules\strip-bom\package.json",
    "D:\Divine Bytes\node_modules\.pnpm\yargs-parser@21.1.1\node_modules\yargs-parser\package.json"
)

foreach ($filePath in $remainingFiles) {
    $item = Get-Item $filePath -ErrorAction SilentlyContinue
    if ($item) {
        $target = ($item.Target | Select-Object -First 1)
        if ($target) {
            $namePart = Split-Path (Split-Path $filePath -Parent) -Leaf
            $json = '{"name":"' + $namePart + '","version":"0.0.0","description":"","license":"MIT","main":"./index.js"}'
            [System.IO.File]::WriteAllText($target, $json)
            Write-Host "Fixed $namePart at $target"
        }
    }
}
