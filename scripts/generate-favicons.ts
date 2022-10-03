import generateFavicons, { generateSocialImage } from '@stefanprobst/favicons'
import { log } from '@stefanprobst/log'
import fs from 'fs/promises'
import path from 'path'

import { createAssetLink } from '@/lib/create-asset-link'
import { manifestFileName, metadata, openGraphImageName } from '~/config/metadata.config'

async function generate(): Promise<void> {
  const publicFolder = path.join(process.cwd(), 'public')

  await Promise.all(
    Object.values(metadata).map(async (config) => {
      const inputFilePath = path.join(publicFolder, config.logo.href)
      const outputFolder = path.join(publicFolder, createAssetLink({ locale: config.locale }))

      await generateFavicons({
        inputFilePath,
        outputFolder,
        maskable: config.logo.maskable,
        manifestFileName,
        name: config.title,
        shortName: config.shortTitle,
      })

      if (path.extname(inputFilePath) === '.svg') {
        await fs.copyFile(inputFilePath, path.join(outputFolder, 'icon.svg'))
      }

      await generateSocialImage(
        path.join(publicFolder, config.image.href),
        path.join(outputFolder, openGraphImageName),
        { fit: config.image.fit },
      )
    }),
  )
}

generate()
  .then(() => {
    log.success('Successfully generated favicons.')
  })
  .catch((error) => {
    log.error('Failed to generate favicons.\n', String(error))
  })
