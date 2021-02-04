/**
 * Copyright (c) 2008-2017 Regents of the University of California (Regents).
 * Created by WISE, Graduate School of Education, University of California, Berkeley.
 *
 * This software is distributed under the GNU General Public License, v3,
 * or (at your option) any later version.
 *
 * Permission is hereby granted, without written agreement and without license
 * or royalty fees, to use, copy, modify, and distribute this software and its
 * documentation for any purpose, provided that the above copyright notice and
 * the following two paragraphs appear in all copies of this software.
 *
 * REGENTS SPECIFICALLY DISCLAIMS ANY WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE. THE SOFTWARE AND ACCOMPANYING DOCUMENTATION, IF ANY, PROVIDED
 * HEREUNDER IS PROVIDED "AS IS". REGENTS HAS NO OBLIGATION TO PROVIDE
 * MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS, OR MODIFICATIONS.
 *
 * IN NO EVENT SHALL REGENTS BE LIABLE TO ANY PARTY FOR DIRECT, INDIRECT,
 * SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST PROFITS,
 * ARISING OUT OF THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN IF
 * REGENTS HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
package org.wise.portal.service.portal;

import java.io.Serializable;

import org.wise.portal.dao.ObjectNotFoundException;
import org.wise.portal.domain.portal.Portal;

/**
 * Service to allow presentation tier objects to work with the Portal domain.
 * @author Hiroki Terashima
 */
public interface PortalService {

  Portal getById(Serializable id) throws ObjectNotFoundException;

  /**
   * Updates specified portal
   */
  void updatePortal(Portal portal);

  /**
   * Returns this WISE's version infomation as JSON
   * @return
   * @throws Exception
   */
  String getWISEVersion() throws Exception;

  /**
   * Get the default project metadata settings
   * @return the default project metadata settings
   */
  String getDefaultProjectMetadataSettings();

  /**
   * @return the default project library groups
   */
  String getDefaultProjectLibraryGroups();

  String getDefaultAnnouncement();
}
