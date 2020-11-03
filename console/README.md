# Compact Edge Console

## Troubleshooting

- [sass-issue](https://github.com/sass/node-sass/issues/2756)

```powershell
Error: resolve-url-loader: CSS error
source-map information is not available at url() declaration (found orphan CR, try removeCR option)```
```

> node_modules/resolve-url-loader/index.js => removeCR: false >> removeCR: true\
> package.json => "build": "GENERATE_SOURCEMAP=false react-scripts build" >> "build": "set "GENERATE_SOURCEMAP=false" && react-scripts build"
