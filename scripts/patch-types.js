const { typesAlias, types, typesBundle } = require('@acala-network/types')
const compose = require('lodash/fp/compose')
const yaml = require('yaml')
const fs = require('fs')
const path = require('path')

function getConfigPath (configPath = 'project.yaml') {
    return path.resolve(__dirname, '../', configPath)
}

function readConfig (configPath = 'project.yaml') {
    const content = fs.readFileSync(getConfigPath(configPath), 'utf-8')

    return yaml.parse(content)
}

function patchTypesToConfig (config) {
    const _config = {...config}

    _config['network'] = {
        ...config['network'],
        types,
        typesAlias,
	typesBundle
    }

    return _config
}

function writeConfig (config, configPath = 'project.yaml') {
    const _config = yaml.stringify(config, undefined)

    fs.writeFileSync(getConfigPath(configPath), _config, { encoding: 'utf-8' })
}

const run = compose(writeConfig, patchTypesToConfig, readConfig)

run()
