const { typesAlias, types } = require('@acala-network/types')
const yaml = require('yaml')
const fs = require('fs')
const path = require('path')

function getConfigPath (configPath = 'project.yaml') {
    return path.resolve(__dirname, '../', configPath)
}

function readConfig (configPath = 'project.yaml') {
    const content = fs.readFileSync(getConfigPath(), 'utf-8')

    return yaml.parse(content)
}

function patchTypesToConfig (config) {
    config['network'] = {
        ...config['network'],
        types,
        typesAlias
    }
}

function writeConfig (config, configPath = 'project.yaml') {
    const _config = yaml.stringify(config, { })

    fs.writeFileSync(getConfigPath(), _config, { encoding: 'utf-8' })
}

// run
(() => {
    const config = readConfig()

    patchTypesToConfig(config)

    writeConfig(config)
})()